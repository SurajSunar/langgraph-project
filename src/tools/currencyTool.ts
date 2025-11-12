import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const convertCurrency = tool(
  async ({ fromCurrency, toCurrency, amount }: any) => {
    if (!isNaN(amount)) {
      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}&symbols=${toCurrency}`
      );
      const result = await response.json();
      const convertedAmount = (amount * result?.rates?.[toCurrency]).toFixed(2);
      return convertedAmount;
    } else {
      return "Amount not in numeric form";
    }
  },
  {
    name: "currencyConverter",
    description:
      "This tool helps to convert currency rate based on from currency and to currency",
    schema: z.object({
      fromCurrency: z.string().describe("Enter from currency"),
      toCurrency: z.string().describe("Enter to currency"),
      amount: z.string().describe("Enter the amount"),
    }),
  }
);
