import axios from "axios";
import tunnel from "tunnel";
import logger from "./consola/logger";
import * as cheerio from "cheerio";
import {
  BrightDataScrapedPage,
  BrightDataSearchResult,
} from "@/types/brightDataClient";

// Proxy con túnel Bright Data
const agent = tunnel.httpsOverHttp({
  proxy: {
    host: "brd.superproxy.io",
    port: 33335,
    proxyAuth: "brd-customer-hl_13196fde-zone-serp_api3:ix1g585pw440",
  },
  rejectUnauthorized: false,
});

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

    // Validar que el link no sea de navegación interna de Google
    if (title && link && link.startsWith("http")) {
      results.push({ title, link, snippet });
    }
  });

  // Scrapea el contenido adicional de cada resultado
  const resultsWithScrapedData = await Promise.all(
    results.map(async (result) => {
      const scrapedData = await scrapePage(result.link);
      return { ...result, ...scrapedData };
    })
  );

  return resultsWithScrapedData.filter(Boolean); // Elimina nulls
}

// Scrapea el contenido de una página individual
async function scrapePage(url: string): Promise<BrightDataScrapedPage | null> {
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
    if (error instanceof Error) {
      logger.error(`[SCRAPE-PAGE-ERROR] ${url}`, error.message);
    } else {
      logger.error(`[SCRAPE-PAGE-ERROR] ${url}`, error);
    }
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

export { fetchGoogleViaBrightData };
