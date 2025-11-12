import { HumanMessage } from "@langchain/core/messages";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";

const GraphState = Annotation.Root({
  query: Annotation<string>,
  response: Annotation<string>,
});

const llmCall = async (state: any) => {
  const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.1:latest",
  });

  const result = await llm.invoke([new HumanMessage(state.query)]);

  return {
    response: result.content,
  };
};

const workflow = new StateGraph(GraphState);

workflow
  .addNode("llm_node", llmCall)
  .setFinishPoint(START)
  .addEdge(START, "llm_node")
  .addEdge("llm_node", END);

const app = workflow.compile();

async function ollamaChat(query: string) {
  const initialState = { query, response: "" };
  const result = await app.invoke(initialState);
  console.log("Final State:", result);

  return result;
}

export { ollamaChat };
