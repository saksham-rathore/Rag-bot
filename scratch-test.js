import fs from "fs";
// const fs = require('fs');
const env = fs.readFileSync(".env", "utf8");
const key = env.match(/GEMINI_API_KEY=\"([^\"]+)\"/)[1];

fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=" +
    key,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text: "test" }] },
    }),
  },
)
  .then((res) => res.text())
  .then(console.log);
