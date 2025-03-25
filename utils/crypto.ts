function decodeBase64(base64String: string) {
  try {
    return Buffer.from(base64String, "base64").toString("utf-8");
  } catch (error) {
    console.error("Error al decodificar Base64:", error);
    return "";
  }
}

export { decodeBase64 };
