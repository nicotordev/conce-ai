import {
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlineVideoCamera,
  AiOutlineAudio,
} from "react-icons/ai";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileCode,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

export const filesConstants = {
  filesIcon: {
    // Imágenes
    "image/jpeg": AiOutlinePicture,
    "image/png": AiOutlinePicture,
    "image/gif": AiOutlinePicture,
    "image/webp": AiOutlinePicture,
    "image/svg+xml": AiOutlinePicture,

    // Videos
    "video/mp4": AiOutlineVideoCamera,
    "video/webm": AiOutlineVideoCamera,
    "video/ogg": AiOutlineVideoCamera,

    // Audio
    "audio/mpeg": AiOutlineAudio,
    "audio/ogg": AiOutlineAudio,
    "audio/wav": AiOutlineAudio,

    // Documentos
    "application/pdf": FaFilePdf,
    "application/msword": FaFileWord,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      FaFileWord,
    "application/vnd.ms-excel": FaFileExcel,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      FaFileExcel,
    "application/vnd.ms-powerpoint": FaFilePowerpoint,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      FaFilePowerpoint,

    // Archivos comprimidos
    "application/zip": FaFileArchive,
    "application/x-rar-compressed": FaFileArchive,
    "application/x-7z-compressed": FaFileArchive,

    // Código
    "text/html": FaFileCode,
    "text/css": FaFileCode,
    "application/javascript": FaFileCode,
    "application/json": FaFileCode,
    "text/plain": FaFileCode,
  } as Record<string, IconType>,
};

// Función opcional para obtener un ícono seguro
export const getFileIcon = (mimeType: string): IconType => {
  return filesConstants.filesIcon[mimeType] || AiOutlineFile;
};
