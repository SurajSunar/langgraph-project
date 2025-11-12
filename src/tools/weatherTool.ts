import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

export const weatherTool = new DynamicStructuredTool({
  name: "getWeather",
  description: "get weather of the requested city",
  schema: z.object({
    location: z.string().describe("The city and state, e.g. San Francisco, CA"),
  }),
  func: async (input: { location: string }) => {
    console.log(`Calling getWeather for ${input.location}`);
    if (input.location === "San Francisco, CA") {
      return JSON.stringify({ temperature: 72, conditions: "sunny" });
    }
    return JSON.stringify({ temperature: 50, conditions: "rainy" });
  },
});
