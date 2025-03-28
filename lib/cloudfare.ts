import axios, { AxiosError } from "axios";
import { News } from "@prisma/client";
import logger from "./consola/logger";
import { v4 } from "uuid";
import nicodropzone from "./@nicotordev/nicodropzone";
import { fileTypeFromBuffer } from "file-type";
import openAIClient from "./open-ai"; // ✅ Reemplazamos Google Generative AI

async function generateNewsImage(news: News) {
  try {
    // ✅ 1. Generación de prompt usando OpenAI
    const promptResponse = await openAIClient.chat.completions.create({
      model: "gpt-4o", // Usa GPT-4o para mejores resultados
      messages: [
        {
          role: "system",
          content: `
        Eres un generador de prompts para modelos de texto a imagen. A partir del contenido de una noticia, tu tarea es crear un prompt detallado, en lenguaje natural, para generar una imagen que represente visualmente dicha noticia.

        Incluye los elementos clave como contexto, personajes, locación, ambiente, emociones o tono, si son relevantes. Evita repetir literalmente el texto de la noticia y enfócate en describir la imagen que se debería generar.

        Devuelve SOLO el prompt para generar la imagen.
      `,
        },
        {
          role: "user",
          content: `Noticia:
        ${JSON.stringify(news, null, 2)}`,
        },
      ],
      temperature: 0.7, // Creatividad controlada
    });

    const prompt = promptResponse.choices[0]?.message?.content?.trim();

    if (!prompt) {
      throw new Error("No se generó un prompt válido para la imagen.");
    }

    logger.info(`[✅ PROMPT GENERADO] ${prompt}`);

    // ✅ 2. Generación de la imagen usando Cloudflare AI Workers
    const imageResponse = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/48a9712a4636052342824b8ef20aab89/ai/run/@cf/lykon/dreamshaper-8-lcm",
      {
        prompt: prompt,
        negative_prompt:
          "blurry, distorted, low quality, watermark, violent, sexual, nudity, offensive, copyrighted",
        height: 400,
        width: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFARE_AI_WORKER_TOKEN}`, // Asegúrate de tener esta variable en .env
        },
        responseType: "arraybuffer", // ✅ Para recibir binario
      }
    );

    const buffer = Buffer.from(imageResponse.data);

    // ✅ 3. Detectar el tipo de archivo generado
    const result = await fileTypeFromBuffer(buffer);

    if (!result) {
      throw new Error("No se pudo detectar el tipo de archivo.");
    }

    const { ext, mime } = result;

    // ✅ 4. Convertir el blob en un File
    const file = new File([buffer], v4() + `.${ext}`, { type: mime });

    logger.info(`[✅ IMAGEN CREADA] ${file.name}`);

    // ✅ 5. Subir la imagen generada usando nicodropzone
    const uploadedFile = await nicodropzone.uploadFiles("news", [file]);

    logger.info(`[✅ IMAGEN DE NOTICIA GENERADA] ${uploadedFile[0].src}`);
    return uploadedFile[0].src;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(
        "[❌ ERROR AL GENERAR IMAGEN DE NOTICIA]",
        `Status: ${error.response?.status} - ${error.response?.data}`
      );
    } else {
      logger.error("[❌ ERROR AL GENERAR IMAGEN DE NOTICIA]", error);
    }
    return null;
  }
}

export { generateNewsImage };
