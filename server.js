import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message required" });
    }

    // ===== SERPER SEARCH =====
    let webData = "";

    try {
      const serperRes = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: userMessage })
      });

      const serperJson = await serperRes.json();

      if (serperJson.organic && serperJson.organic.length > 0) {
        const first = serperJson.organic[0];

        webData = `
REAL-TIME INTERNET DATA:
Title: ${first.title}
Snippet: ${first.snippet}
Link: ${first.link}
`;
      }

    } catch (e) {
      console.log("Serper error:", e.message);
    }

    // ===== SYSTEM PROMPT =====
    const systemPrompt = {
      role: "system",
      content: `
You are Bhumi AI created by Kunal Kumar.

STRICT RULES:
1. Never assume anything about the user.
2. Never add extra details not given.
3. If unknown, say "I do not have that information."
4. Answer short questions briefly.
5. Answer detailed questions in detail.
6. Solve math step-by-step.
7. Never mention OpenAI or ChatGPT.
`
    };

    // ===== FINAL USER MESSAGE =====
    const finalMessage = webData
      ? `${userMessage}

Use the following REAL-TIME INTERNET DATA if relevant:
${webData}`
      : userMessage;

    chatHistory.push({ role: "user", content: finalMessage });

    // ===== OPENAI CALL =====
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 700,
        messages: [systemPrompt, ...chatHistory]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      let reply = data.choices[0].message.content;

      reply = reply.replace(/[#*`>]/g, "").trim();

      chatHistory.push({ role: "assistant", content: reply });

      return res.json({ reply });
    }

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Bhumi AI Backend Running 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
