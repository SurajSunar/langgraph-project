import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { convertCurrency } from "./tools/currencyTool";
import { getUsersBasedOnType } from "./tools/userTool";

dotenv.config(); // Load environment variables from .env

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2,
});

export const agent = createReactAgent({
  llm: llm,
  tools: [convertCurrency, getUsersBasedOnType],
});
