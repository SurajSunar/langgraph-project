import { END, StateGraph } from "@langchain/langgraph";
import { number, string } from "zod";

// Define the state of the graph
const graphState = {
  value: "", // Accumulates a value
  history: [], // Keeps a history of operations
  nextNode: "",
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

const tripleNode = (state: any) => {
  const newValue = state.value * 3;
  return {
    value: newValue,
    history: [...state.history, `Tripled to ${newValue}`],
    nextNode: "",
  };
};

const checker = (state: any) => {
  const newValue = state.value;
  return {
    ...state,
    nextNode: newValue < 5 ? "double" : "triple",
  };
};

const routeDecision = (state: any) => {
  return state.nextNode;
};

// Build the graph
const workflow = new StateGraph({ channels: graphState } as any)
  .addNode("increment", incrementNode)
  .addNode("checker", checker)
  .addNode("double", doubleNode)
  .addNode("triple", tripleNode)
  .setEntryPoint("increment") // Start at the 'increment' node
  .addEdge("increment", "checker")
  .addConditionalEdges("checker", routeDecision, {
    double: "double",
    triple: "triple",
  })
  //.addEdge("increment", "double") // Transition from 'increment' to 'double'
  .addEdge("double", END)
  .addEdge("triple", END);

// Compile the graph
const app = workflow.compile();

async function start(number: number) {
  const initialState = { value: number, history: ["Initial value: " + number] };
  const result = await app.invoke(initialState);
  console.log("Final State:", result);

  return result;
}

export { start };
