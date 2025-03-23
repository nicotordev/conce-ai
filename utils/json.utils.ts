function extractValidJSON<T = unknown>(texto: string): T | null {
    try {
      // Extraer todo lo que está entre ```json y ```
      const regex = /```json\s*([\s\S]*?)\s*```/;
      const match = texto.match(regex);
  
      if (match && match[1]) {
        const jsonLimpio = match[1].trim();
        return JSON.parse(jsonLimpio);
      }
  
      // Alternativa si no viene con triple backticks
      const inicio = texto.indexOf('{');
      const fin = texto.lastIndexOf('}');
      if (inicio !== -1 && fin !== -1 && fin > inicio) {
        const jsonPosible = texto.slice(inicio, fin + 1).trim();
        return JSON.parse(jsonPosible);
      }
  
      return null;
    } catch (error) {
      console.error("Error al parsear JSON:", error);
      return null;
    }
  }
  
export {
    extractValidJSON,
}
  