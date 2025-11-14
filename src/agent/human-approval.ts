import {
  Command,
  END,
  interrupt,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";

interface GraphState {
  iterations: number;
  approved: boolean;
  userInput?: string;
}

const performTaskNode = async (
  state: GraphState
): Promise<Partial<GraphState>> => {
  console.log("--- Performing Task Node ---", state);
  const newIterations = state.iterations + 1;
  console.log(`Current iteration: ${newIterations}`);
  return { ...state, iterations: newIterations } as any;
};

const humanApprovalNode = async (
  state: GraphState
): Promise<Partial<GraphState>> => {
  console.log("--- Waiting for Human Approval ---");
  // This is where we trigger the interrupt
  const approval = await interrupt(
    "Do you approve continuing the loop? (true/false)"
  );

  // The value from 'resume' will be returned by the interrupt() callz
  const isApproved = approval === "true"; // Assuming human inputs 'true' or 'false'
  console.log(`Human decision: ${isApproved}`);
  return { approved: isApproved };
};

const finalNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  console.log("--- Final Node: Execution Complete ---");
  return state;
};

// 3. Define the Conditional Logic (decides the next step)
const shouldContinue = (
  state: GraphState
): "perform_task" | "human_approval" | "final" | typeof END => {
  if (state.iterations >= 3 && !state.approved) {
    // If we reach 3 iterations and haven't been approved, ask for approval
    return "human_approval";
  } else if (state.approved) {
    console.log("else if (state.approved)");
    // If approved, end the process
    return "final";
  }
  // Otherwise, continue the loop
  return "perform_task";
};

const graphBuilder = new StateGraph<GraphState>({
  channels: { iterations: 0 },
} as any);

graphBuilder
  .addNode("perform_task", performTaskNode)
  .addNode("human_approval", humanApprovalNode)
  .addNode("final", finalNode)
  .setEntryPoint("perform_task")
  .addEdge("final", END)
  .addConditionalEdges("perform_task", shouldContinue, {
    perform_task: "perform_task",
    human_approval: "human_approval",
    [END]: END,
  })
  .addEdge("human_approval", "final");

// Compile the graph
const graph = graphBuilder.compile({
  checkpointer: new MemorySaver(),
});

async function humanApproval() {
  const config = { configurable: { thread_id: "thread-1" } }; // Required for persistence/interrupts

  console.log("--- Starting Graph Execution ---");

  // Initial run
  const result1 = await graph.invoke(
    { iterations: 0, approved: false },
    config
  );
  console.log("Graph result 1:", result1, "\n");

  // The graph pauses at the 'human_approval' node.
  // To resume, we need to invoke it again with a Command.resume
  console.log("--- Resuming Graph with Approval ---");
  // 'true' will be the value returned by the interrupt() call
  const result2 = await graph.invoke(new Command({ resume: "false" }), config);
  console.log("Graph result 2:", result2);
  return result2;
}

export { humanApproval, graph as HumanApprovalGraph };
