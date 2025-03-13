import * as google from "@google/generative-ai";

const genAI = new google.GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY
);


export default genAI;