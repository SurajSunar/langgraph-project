import { StateGraph } from "@langchain/langgraph";
import { number, string } from "zod";

// Define the state of the graph
const graphState = {
  value: number, // Accumulates a value
  history: string, // Keeps a history of operations
};

// Define the nodes (functions) of the graph
const incrementNode = (state: any) => {
  const newValue = state.value + 1;
  return {
    value: newValue,
    history: [...state.history, `Incremented to ${newValue}`],
  };
};

const doubleNode = (state: any) => {
  const newValue = state.value * 2;
  return {
    value: newValue,
    history: [...state.history, `Doubled to ${newValue}`],
  };
};

// Build the graph
const workflow = new StateGraph({ channels: graphState } as any)
  .addNode("increment", incrementNode)
  .addNode("double", doubleNode)
  .setEntryPoint("increment") // Start at the 'increment' node
  .addEdge("increment", "double") // Transition from 'increment' to 'double'
  .setFinishPoint("double"); // End at the 'double' node

// Compile the graph
const app = workflow.compile();

async function start(number: number) {
  const initialState = { value: number, history: ["Initial value: " + number] };
  const result = await app.invoke(initialState);
  console.log("Final State:", result);

  return result;
}

export { start };
