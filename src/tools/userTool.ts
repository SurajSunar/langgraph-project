import { tool } from "@langchain/core/tools";
import { USERS } from "../data/users";
import { z } from "zod";

export const getUsersBasedOnType = tool(
  async ({ city, savings, posts }: any) => {
    let results: any = [];
    console.log(city, savings, posts, USERS.length);

    try {
      if (city) {
        results = (results.length ? results : USERS).filter((user: any) =>
          (user.city || "").toLowerCase().includes(city.toLowerCase())
        );
      }

      if (savings) {
        results = (results.length ? results : USERS).filter(
          (user: any) => user.savings > +savings
        );
      }

      if (posts) {
        results = (results.length ? results : USERS).filter(
          (user: any) => user.posts > +posts
        );
      }
    } catch (error) {
      console.log(error);
    }

    return JSON.stringify(results);
  },
  {
    name: "getUsersBasedOnType",
    description: "Get user list based on message from the client side",
    schema: z.object({
      city: z.string().describe("City in which user is living").optional(),
      savings: z.number().describe("Amount of savings by the user").optional(),
      posts: z.number().describe("NUmber od post by the user").optional(),
    }),
  }
);
