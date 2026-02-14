import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("Bhumi backend running");
});

/* ---------- CHAT ROUTE ---------- */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Bhumi AI created by Kunal Kumar." },
        { role: "user", content: message },
      ],
      max_tokens: 120,
      temperature: 0.2,
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error." });
  }
});

/* ---------- START SERVER ---------- */
app.listen(5000, "0.0.0.0", () => {
  console.log("Bhumi backend running on port 5000");
});
