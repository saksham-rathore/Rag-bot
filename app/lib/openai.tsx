import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(question: string, context: string) {
  const prompt = `
You are a helpful AI assistant.

Use ONLY the context below to answer.

Context:
${context}

Question:
${question}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

export default openai;
