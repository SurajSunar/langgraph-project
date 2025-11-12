import { ChatOllama } from "@langchain/ollama";
import { weatherTool } from "../tools/weatherTool";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2,
});

// Bind the tools to the model
const modelWithTools = model.bindTools([weatherTool]);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant who can access external tools. Use them only when necessary.
     - weatherTool - Use this tool only when query is specifically asking of weather of any location or city. 

     If its not related to tool usages, you can route to normal route if query and response.
    `,
  ],
  ["human", "{input}"],
]);

// The chain pipes the prompt to the model with tools bound
const chain = prompt.pipe(modelWithTools);

async function weatherLlm(query: string) {
  const response = await chain.invoke({
    input: query,
  });

  console.log("Model Response:", response.content);
  console.log("Tool Calls:", response.tool_calls);

  // You need logic to execute the tool calls and feed the result back to the model for a final answer
  if (response.tool_calls && response.tool_calls.length > 0) {
    for (const toolCall of response.tool_calls) {
      if (toolCall.name === "getWeather") {
        const toolResult = await weatherTool.func(toolCall.args as any);
        console.log("Tool execution result:", toolResult);
        // You would typically feed this result back into a new turn of the conversation
        return toolResult;
      }
    }
  }

  return response.content;
}

export { weatherLlm };
