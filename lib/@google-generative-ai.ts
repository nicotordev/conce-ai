import * as google from "@google/generative-ai";

const genAI = new google.GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY
);


export default genAI;