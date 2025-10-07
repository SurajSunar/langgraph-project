import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2
});

export const agent = createReactAgent({
  llm: llm,
  tools: [],
});