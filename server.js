import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message required" });
    }

    // ================= SERPER (ONLY WHEN NEEDED) =================
    let webData = "";

    const lowerMsg = userMessage.toLowerCase();
    const needsSearch =
      lowerMsg.includes("latest") ||
      lowerMsg.includes("news") ||
      lowerMsg.includes("current") ||
      lowerMsg.includes("today");

    if (needsSearch) {
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

        if (serperJson.organic?.length) {
          const first = serperJson.organic[0];
          webData = `
Internet Result:
Title: ${first.title}
Snippet: ${first.snippet}
`;
        }
      } catch (e) {
        console.log("Serper error:", e.message);
      }
    }

    // ================= SYSTEM PROMPT =================
    const systemPrompt = {
      role: "system",
      content: `
You are Bhumi AI created by Kunal Kumar.

Rules:
- Never assume user identity or profession.
- If information is not provided, say "I do not have that information."
- Short question → short answer.
- Detailed question → detailed answer.
- Solve maths, physics, chemistry step-by-step.
- Do not use symbols like # * markdown.
- Never mention OpenAI or ChatGPT.
`
    };

    // ================= FINAL MESSAGE =================
    const finalMessage = webData
      ? `${userMessage}

Use this information if relevant:
${webData}`
      : userMessage;

    // ================= OPENAI CALL =================
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          systemPrompt,
          { role: "user", content: finalMessage }
        ]
      })
    });

    const data = await response.json();

    // ================= ERROR SAFE =================
    if (!data.choices || data.choices.length === 0) {
      return res.json({ reply: "Please try again." });
    }

    let reply = data.choices[0].message.content;

    reply = reply.replace(/[#*`>]/g, "").trim();

    return res.json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Server temporarily busy. Try again." });
  }
});

app.get("/", (req, res) => {
  res.send("Bhumi AI Backend Running 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});