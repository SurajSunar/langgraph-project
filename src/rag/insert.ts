import { RESUME_RAG } from "../data/resume";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings, pool } from "./config";

async function insertVectorStore() {
  try {
    console.log("🔹 Initializing pgvector store...");

    console.log("Loading documents into database...");
    const text = RESUME_RAG;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const docs = await splitter.splitText(text);

    const docEmbeddings = await embeddings.embedDocuments(docs);
    let index = 0;

    for (let i = 0; i < docs.length; i++) {
      const pgVector = `[${docEmbeddings[i].join(",")}]`;

      await pool.query(
        "INSERT INTO documents (pageContent, embedding) VALUES ($1, $2)",
        [docs[i], pgVector]
      );
    }

    console.log(`✅ Loaded ${docs.length} documents into pgvector!`);
  } catch (error) {
    throw error;
  }
}

export { insertVectorStore };
