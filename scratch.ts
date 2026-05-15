import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { GoogleGenerativeAI } from "@google/generative-ai";

interface ModelInfo {
  name: string;
  supportedGenerationMethods: string[];
}

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Available models:");
    const embedModels = data.models.filter((m: ModelInfo) => m.supportedGenerationMethods.includes("embedContent"));
    console.log(embedModels.map((m: ModelInfo) => m.name));
  } catch (err) {
    console.error(err);
  }
}

listModels();
