import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent("Hello world");
    console.log("text-embedding-004 output length:", result.embedding.values.length);
  } catch (e) {
    console.error("text-embedding-004 error:", e.message);
  }
}

run();
