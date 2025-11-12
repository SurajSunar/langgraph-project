// src/index.ts
import express, { Application, Request, Response } from "express";
import { agent } from "./agent";
import { HumanMessage } from "@langchain/core/messages";
import { start } from "./agent/increment-double";
import { ollamaChat } from "./agent/ollama-chat";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

app.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const result = await agent.invoke({
      messages: [new HumanMessage(req.body.messages)],
    });

    res.send({ result: result.messages[result.messages.length - 1].content });
  } catch (error) {
    res.send("Error: " + error);
  }
});

app.post("/increment", async (req: Request, res: Response) => {
  console.log(req.body);
  const { number } = req.body;
  try {
    const result = await start(+number);

    res.send({ result });
  } catch (error) {
    res.send("Error: " + error);
  }
});

app.post("/ollama", async (req: Request, res: Response) => {
  console.log(req.body);
  const { query } = req.body;
  try {
    const { query } = req.body;
    const result = await ollamaChat(query);

    res.send({ result });
  } catch (error) {
    res.send("Error: " + error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
