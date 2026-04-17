import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: process.env.OLLAMA_BASE_URL,
  apiKey: process.env.OLLAMA_API_KEY
});

async function run() {
  const response = await openai.chat.completions.create({
    model: process.env.OLLAMA_MODEL!,
    messages: [
      {
        role: "user",
        content: "Hello  Ollama I Am Mohammad Husain and today i am learing Langchain.Explain LangChain."
      }
    ]
  });

  console.log(response.choices[0]!.message.content);
}

run();