require("dotenv").config();
import express from "express";
import Groq from "groq-sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import cors from "cors";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 200,
            temperature: 0
        });

        const answer = response.choices[0]?.message?.content?.trim().toLowerCase() || ""; // react or node
        if (answer.includes("react")) {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }

        if (answer.includes("node")) {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(403).json({ message: "You cant access this" });
    } catch (error: any) {
        console.error("Template error:", error);
        res.status(500).json({ error: error.message || "Failed to generate template" });
    }
});

app.post("/chat", async (req, res) => {
    const messages = req.body.messages;

    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: getSystemPrompt()
                },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 8000,
        });

        console.log(response);

        res.json({
            response: response.choices[0]?.message?.content || ""
        });
    } catch (error: any) {
        console.error("Chat error:", error);
        res.status(500).json({ error: error.message || "Failed to generate chat response" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
