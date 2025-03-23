import axios from "axios";
import tunnel from "tunnel";
import logger from "./consola/logger";
import * as cheerio from "cheerio";
import {
  BrightDataScrapedPage,
  BrightDataSearchResult,
} from "@/types/brightDataClient";
import googleGenerativeAI from "./@google-generative-ai";
import { MessageSender } from "@prisma/client";
import { AINews } from "@/types/news";
import { extractValidJSON } from "@/utils/json.utils";

// Proxy con túnel Bright Data
const agent = tunnel.httpsOverHttp({
  proxy: {
    host: "brd.superproxy.io",
    port: 33335,
    proxyAuth: "brd-customer-hl_13196fde-zone-serp_api3:ix1g585pw440",
  },
  rejectUnauthorized: false,
});

// Lista de sitios que bloquean scraping directo
const blockedHosts = ["24horas.cl", "biobiochile.cl", "emol.com"];

function isBlocked(url: string) {
  return blockedHosts.some((host) => url.includes(host));
}

// Scrapea el contenido de una página individual
async function scrapePage(url: string): Promise<BrightDataScrapedPage | null> {
  if (isBlocked(url)) {
    logger.warn(`[SCRAPE-PAGE] Skipped blocked host: ${url}`);
    return null;
  }

  try {
    const { data: html, headers } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    if (!headers["content-type"]?.includes("text/html")) {
      logger.warn(`[SCRAPE-PAGE] Skipped non-HTML: ${url}`);
      return null;
    }

    const $ = cheerio.load(html);
    const title = $("title").text().trim();
    const h1 = $("h1").first().text().trim();
    const paragraphs = $("p")
      .slice(0, 5)
      .map((_, el) => $(el).text().trim())
      .get();

    return { url, title, h1, textPreview: paragraphs };
  } catch (error: unknown) {
    logger.error(
      `[SCRAPE-PAGE-ERROR] ${url}`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

// Extrae resultados de una búsqueda de Google
async function parseGoogleResults(
  html: string
): Promise<(BrightDataSearchResult & Partial<BrightDataScrapedPage>)[]> {
  const $ = cheerio.load(html);
  const results: BrightDataSearchResult[] = [];

  $("div.tF2Cxc").each((_, el) => {
    const title = $(el).find("h3").text().trim();
    const link = $(el).find("a").attr("href") || "";
    const snippet = $(el).find(".VwiC3b").text().trim();

    if (title && link && link.startsWith("http")) {
      results.push({ title, link, snippet });
    }
  });

  const resultsWithScrapedData = await Promise.all(
    results.map(async (result) => {
      if (isBlocked(result.link)) {
        return {
          ...result,
          textPreview: [result.snippet], // fallback
        };
      }

      const scrapedData = await scrapePage(result.link);
      return {
        ...result,
        textPreview: (scrapedData?.textPreview ?? [result.snippet]).filter(
          (text): text is string => text !== undefined
        ) as string[],
        title: scrapedData?.title ?? result.title,
      };
    })
  );

  return resultsWithScrapedData
    .filter((r) => r && r.textPreview?.length)
    .filter((r) => r.textPreview.length) as {
    title: string;
    link: string;
    snippet: string;
    textPreview: string[];
  }[];
}

// Búsqueda en Google con proxy de Bright Data
async function fetchGoogleViaBrightData(query: string) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query + " site:cl"
    )}`;
    logger.info(`[FETCH-GOOGLE] ${searchUrl}`);

    const { data } = await axios.get(searchUrl, {
      httpsAgent: agent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    return await parseGoogleResults(data);
  } catch (error: unknown) {
    logger.error(`[FETCH-GOOGLE-VIA-BRIGHT-DATA-ERROR]`, error);
    return null;
  }
}

// Con evaluación de si vale la pena buscar
async function fetchGoogleViaBrightDataWithQueryEvaluation(
  query: string,
  modelName: string,
  messages: {
    sender: MessageSender;
    content: string;
  }[]
) {
  try {
    const aiModel = googleGenerativeAI.genAI.getGenerativeModel({
      model: modelName,
    });

    const chat = aiModel.startChat({});

    const checkSearch = await chat.sendMessage(
      `Contexto: ${JSON.stringify(
        messages,
        null,
        2
      )}\n¿La frase "${query}" requiere hacer una búsqueda en Google para obtener una respuesta precisa? Responde solo "sí" o "no".`
    );

    const shouldSearch = checkSearch.response.text().trim().toLowerCase();
    if (!["si", "sí"].includes(shouldSearch)) return null;

    const reformulated = await chat.sendMessage(
      `Contexto: ${JSON.stringify(
        messages,
        null,
        2
      )}\nConvierte la frase "${query}" en una búsqueda clara y concreta para Google.`
    );

    const searchQuery = reformulated.response.text().trim();
    const searchResults = (await fetchGoogleViaBrightData(searchQuery)) ?? [];

    const formatted = searchResults.length
      ? searchResults
          .map((r, i) => {
            const resumen =
              r.textPreview?.join(" ").slice(0, 300) ?? "(sin resumen)";
            return `${i + 1}. [${r.title}]: ${r.link}\nResumen: ${resumen}`;
          })
          .join("\n\n")
      : "Sin resultados de búsqueda.";

    return formatted !== "Sin resultados de búsqueda."
      ? JSON.parse(formatted)
      : null;
  } catch (err) {
    logger.error(`[FETCH-GOOGLE-VIA-BRIGHT-DATA-QUERY-EVALUATION-ERROR]`, err);
    return null;
  }
}

// Obtener noticias de Google News
async function fetchGoogleNewsViaBrightData(): Promise<AINews[] | null> {
  try {
    const model = googleGenerativeAI.genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash-001",
    });

    const chatSession = model.startChat({});

    const fechaActual = new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const query = `noticias chile ${fechaActual}`;
    const searchResults = await fetchGoogleViaBrightData(query);

    if (!searchResults || !searchResults.length) {
      throw new Error("No se encontraron resultados de búsqueda.");
    }

    const resumenHTML = searchResults
      .map((r, i) => {
        const resumen =
          r.textPreview?.join(" ").slice(0, 300) ?? "(sin resumen)";
        return `<div><b>${i + 1}. ${r.title}</b><br>${
          r.link
        }<br>${resumen}</div>`;
      })
      .join("\n");

    const promptEstructura = `
Devuelve únicamente un objeto JSON con el resumen de noticias encontradas en el siguiente HTML extraído de Google News:

${resumenHTML}

El formato debe ser:

{
  "noticias": [
    {
      "titulo": "Título de la noticia",
      "link": "https://link-a-la-noticia.com",
      "resumen": "Resumen breve de la noticia",
      "imagen": "https://link-a-la-imagen.com"
    }
  ]
}

No agregues texto adicional ni explicaciones.`;

    const estructuraResponse = await chatSession.sendMessage(promptEstructura);
    const respuestaJson = estructuraResponse.response.text().trim();

    const validJson = extractValidJSON<{
      noticias: AINews[];
    }>(respuestaJson);

    if (!validJson || !validJson.noticias) {
      throw new Error("No se recibió un JSON válido.");
    }

    return validJson.noticias;
  } catch (error) {
    logger.error("[❌ ERROR AL BUSCAR NOTICIAS CON BRIGHT DATA]", error);
    return null;
  }
}

export {
  fetchGoogleViaBrightData,
  fetchGoogleViaBrightDataWithQueryEvaluation,
  fetchGoogleNewsViaBrightData,
};
