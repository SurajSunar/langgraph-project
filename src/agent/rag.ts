import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "langchain";
import { ChatOllama } from "@langchain/ollama";

const modelGemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2,
});

const modelOllama = new ChatOllama({
  model: "llama3.1:latest",
  maxRetries: 2,
});

async function ragAgent(context: string, query: string) {
  const agent = createReactAgent({
    llm: modelGemini,
    tools: [],
    prompt: `
        You are a helpful assistant. Use the following context to answer:
        Context:
      ${context}

      Question: ${query}
      Answer:
        `,
  });

  const result = await agent.invoke({
    messages: [new HumanMessage(query)],
  });

  console.log(result);

  return result.messages[result.messages.length - 1].content;
}

export { ragAgent };
