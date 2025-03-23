import axios, { AxiosError } from "axios";
import { News } from "@prisma/client";
import logger from "./consola/logger";
import { v4 } from "uuid";
import nicodropzone from "./@nicotordev/nicodropzone";
import { fileTypeFromBuffer } from "file-type";

async function generateNewsImage(news: News) {
  const prompt = `Genera una imagen de la noticia "${JSON.stringify(
    news,
    null,
    2
  )}`;

  try {
    const response = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/48a9712a4636052342824b8ef20aab89/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0",
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
          Authorization: `Bearer ${process.env.CLOUDFARE_AI_WORKER_TOKEN}`, // importante si usás un token
        },
        responseType: "arraybuffer", // 👈 clave para recibir binario
      }
    );


    const buffer = Buffer.from(response.data);

    const result = await fileTypeFromBuffer(buffer);

    if (!result) {
      throw new Error("No se pudo detectar el tipo de archivo");
    }

    const { ext, mime } = result;

    // 👉 Convertir el blob en un File
    const file = new File([buffer], v4() + `.${ext}`, { type: mime });

    console.log(file.name);

    // 👉 Subir con nicodropzone
    const uploadedFile = await nicodropzone.uploadFiles("news", [file]);

    console.log(`[✅ IMAGEN DE NOTICIA GENERADA] ${uploadedFile[0].src}`);
    return uploadedFile[0].src;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(
        "[❌ ERROR AL GENERAR IMAGEN DE NOTICIA]",
        `Status: ${error.response?.status} - ${error.response?.data}`
      );
    }
    logger.error("[❌ ERROR AL GENERAR IMAGEN DE NOTICIA]", error);
    return null;
  }
}

export { generateNewsImage };
