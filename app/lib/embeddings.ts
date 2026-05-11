import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPEN_AI_SECRET_KEY
});