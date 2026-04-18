import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: process.env.OLLAMA_BASE_URL,
  apiKey: process.env.OLLAMA_API_KEY,
});

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const messages: Message[] = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    messages.push({
      role: "user",
      content: userMessage,
    });

    const response = await openai.chat.completions.create({
      model: process.env.OLLAMA_MODEL!,
      messages,
    });

    const reply =
      response.choices[0]?.message?.content || "No response";

    messages.push({
      role: "assistant",
      content: reply,
    });

    res.json({
      reply,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});