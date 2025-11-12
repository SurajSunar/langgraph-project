import { OllamaEmbeddings } from "@langchain/ollama";
import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text:latest",
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export { embeddings, pool };
