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

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Busca en Google, verifica la caché de Prisma y guarda los resultados
 */
async function fetchGoogleViaBrightDataWithQueryEvaluation(
  query: string,
  modelName: string,
  messages: {
    sender: MessageSender;
    content: string;
  }[],
  userId?: string,
  conversationId?: string
) {
  try {
    // 1. Evaluar si realmente necesitamos hacer una búsqueda
    const aiModel = googleGenerativeAI.genAI.getGenerativeModel({
      model: modelName,
    });
    const chat = aiModel.startChat({});

    // Prompt mejorado para evaluar necesidad de búsqueda
    const checkSearchPrompt = `
      Basado en el siguiente historial de conversación y la consulta actual, 
      determina si REALMENTE es necesario hacer una búsqueda en Internet.
      
      Historia de la conversación:
      ${JSON.stringify(messages.slice(-3), null, 2)}
      
      Consulta actual: "${query}"
      
      IMPORTANTE: Responde ÚNICAMENTE "sí" si:
      - Se pregunta por información factual específica (datos, fechas, eventos)
      - Se solicitan noticias o información actualizada
      - Se solicita información sobre entidades, productos o personas específicas
      
      Responde ÚNICAMENTE "no" si:
      - La consulta puede responderse con conocimiento general
      - Es una pregunta hipotética o de opinión
      - Es una solicitud de código o explicación conceptual
      - Es una continuación de conversación que no requiere datos externos nuevos
      
      Responde SOLO con "sí" o "no", sin explicaciones adicionales.`;

    const checkSearch = await chat.sendMessage(checkSearchPrompt);
    const shouldSearch = checkSearch.response.text().trim().toLowerCase();

    if (!["si", "sí", "yes"].includes(shouldSearch)) {
      logger.info(
        `[SEARCH-SKIPPED] Query "${query}" was determined not to need search`
      );
      return null;
    }

    // 2. Reformular la consulta para búsqueda más efectiva
    const reformulatePrompt = `
      Reformula la siguiente consulta en una búsqueda efectiva para Google.
      - Extrae SOLO las palabras clave esenciales
      - Elimina información contextual innecesaria
      - Mantén el idioma original de la consulta
      - NO agregues términos adicionales que no estén en la consulta original
      
      Consulta original: "${query}"
      
      Devuelve SOLO la consulta reformulada, sin explicaciones ni comillas.`;

    const reformulated = await chat.sendMessage(reformulatePrompt);
    const searchQuery = reformulated.response.text().trim();

    logger.info(`[SEARCH-REFORMULATED] "${query}" → "${searchQuery}"`);

    // 3. Verificar si ya tenemos esta búsqueda en la base de datos
    const cachedSearch = await prisma.searchQuery.findFirst({
      where: {
        searchQuery: {
          equals: searchQuery,
          mode: "insensitive",
        },
        // Solo considerar resultados recientes (últimas 24 horas)
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        results: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    // Si encontramos resultados en caché, los devolvemos
    if (cachedSearch && cachedSearch.results.length > 0) {
      logger.info(
        `[SEARCH-CACHE-HIT] Found cached results for "${searchQuery}"`
      );

      return {
        originalQuery: query,
        searchQuery: searchQuery,
        results: cachedSearch.results.map((r) => ({
          position: r.position,
          title: r.title,
          url: r.url,
          snippet: r.snippet,
          source: r.source,
        })),
        fromCache: true,
      };
    }

    // 4. Si no hay caché, realizar la búsqueda
    const searchResults = (await fetchGoogleViaBrightData(searchQuery)) ?? [];

    if (!searchResults.length) {
      logger.info(`[SEARCH-NO-RESULTS] No results found for "${searchQuery}"`);
      return null;
    }

    // 5. Estructurar los resultados
    const formattedResults = {
      originalQuery: query,
      searchQuery: searchQuery,
      results: searchResults.map((r, i) => ({
        position: i + 1,
        title: r.title || "",
        url: r.link || "",
        snippet: r.textPreview?.join(" ").slice(0, 300) || "",
        source: "google",
      })),
      fromCache: false,
    };

    // 6. Guardar los resultados en la base de datos
    try {
      await prisma.searchQuery.create({
        data: {
          originalQuery: query,
          searchQuery: searchQuery,
          userId: userId,
          conversationId: conversationId,
          results: {
            create: formattedResults.results.map((r) => ({
              position: r.position,
              title: r.title,
              url: r.url,
              snippet: r.snippet,
              source: r.source,
            })),
          },
        },
      });
      logger.info(
        `[SEARCH-SAVED] Results saved to database for "${searchQuery}"`
      );
    } catch (dbError) {
      logger.error(
        `[SEARCH-DB-ERROR] Failed to save search results: ${dbError}`
      );
      // Continuamos incluso si el guardado falla
    }

    logger.info(
      `[SEARCH-SUCCESS] Found ${formattedResults.results.length} results for "${searchQuery}"`
    );
    return formattedResults;
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
