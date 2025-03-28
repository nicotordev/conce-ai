import axios from "axios";
import tunnel from "tunnel";
import logger from "./consola/logger";
import * as cheerio from "cheerio";
import {
  BrightDataScrapedPage,
  BrightDataSearchResult,
} from "@/types/brightDataClient";
import openAIClient from "@/lib/open-ai"; // ✅ Usamos OpenAI
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

    // Buscar fecha de publicación en etiquetas comunes
    const publishedAt =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[name="pubdate"]').attr("content") ||
      $('meta[name="publish-date"]').attr("content") ||
      $('meta[name="date"]').attr("content") ||
      $("[datetime]").attr("datetime") ||
      undefined;

    // Buscar imagen destacada
    const imageUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("article img").first().attr("src") ||
      $("img").first().attr("src") ||
      undefined;

    return {
      url,
      title,
      h1,
      textPreview: paragraphs,
      publishedAt,
      imageUrl,
    };
  } catch (error: unknown) {
    logger.error(
      `[SCRAPE-PAGE-ERROR] ${url}`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
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

// Busca en Google, verifica la caché de Prisma y evalúa si es necesario hacer búsqueda
async function fetchGoogleViaBrightDataWithQueryEvaluation(
  query: string,
  modelName: string,
  messages: {
    sender: MessageSender;
    content: string;
  }[]
) {
  try {
    // 1. Evaluar si realmente necesitamos hacer una búsqueda con OpenAI
    const checkSearchPrompt = `
      Basado en el siguiente historial de conversación y la consulta actual, 
      determina si REALMENTE es necesario hacer una búsqueda en Internet.
      
      Historia de la conversación:
      ${JSON.stringify(messages.slice(-3), null, 2)}
      
      Consulta actual: "${query}"
      
      IMPORTANTE: Responde ÚNICAMENTE "sí" o "no".`;

    const checkSearchResponse = await openAIClient.chat.completions.create({
      model: modelName,
      messages: [{ role: "system", content: checkSearchPrompt }],
      temperature: 0,
    });

    const shouldSearch =
      checkSearchResponse.choices[0]?.message?.content?.trim()?.toLowerCase() ??
      "";

    if (!["si", "sí", "yes"].includes(shouldSearch)) {
      logger.info(
        `[SEARCH-SKIPPED] Query "${query}" was determined not to need search`
      );
      return null;
    }

    // 2. Reformular la consulta para búsqueda más efectiva
    const reformulatePrompt = `
      Reformula la siguiente consulta para Google.
      
      Consulta original: "${query}"
      
      Devuelve SOLO la consulta reformulada.`;

    const reformulateResponse = await openAIClient.chat.completions.create({
      model: modelName,
      messages: [{ role: "system", content: reformulatePrompt }],
      temperature: 0.5,
    });

    const searchQuery =
      reformulateResponse.choices[0]?.message?.content?.trim() ?? "";
    logger.info(`[SEARCH-REFORMULATED] "${query}" → "${searchQuery}"`);

    // 3. Realizar la búsqueda en Google si es necesario
    const searchResults = (await fetchGoogleViaBrightData(searchQuery)) ?? [];

    if (!searchResults.length) {
      logger.info(`[SEARCH-NO-RESULTS] No results found for "${searchQuery}"`);
      return null;
    }

    return {
      originalQuery: query,
      searchQuery: searchQuery,
      results: searchResults.map((r, i) => ({
        position: i + 1,
        title: r.title || "",
        url: r.link || "",
        snippet: r.textPreview?.join(" ").slice(0, 300) || "",
        source: "google",
        image: r.imageUrl,
        publishedAt: r.publishedAt,
      })),
    };
  } catch (err) {
    logger.error(`[FETCH-GOOGLE-VIA-BRIGHT-DATA-QUERY-EVALUATION-ERROR]`, err);
    return null;
  }
}

// Obtener noticias de Google News utilizando OpenAI
async function fetchGoogleNewsViaBrightData(): Promise<AINews[] | null> {
  try {
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
Devuelve un objeto JSON con el resumen de noticias en el siguiente HTML:

${resumenHTML}

El formato debe ser:
{
  "noticias": [
    {
      "title": "Título de la noticia",
      "link": "https://link-a-la-noticia.com",
      "description": "Resumen breve de la noticia",
      "image": "https://link-a-la-imagen.com",
      "publishedAt": "2022-01-01T12:00:00.000Z"
    }
  ]
}`;

    const estructuraResponse = await openAIClient.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: promptEstructura }],
    });

    const respuestaJson =
      estructuraResponse.choices[0]?.message?.content?.trim() ?? "";
    const validJson = extractValidJSON<{ noticias: AINews[] }>(respuestaJson);

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
