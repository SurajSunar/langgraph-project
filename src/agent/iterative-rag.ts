import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { embeddings, pool } from "../rag/config";

const modelOllama = new ChatOllama({
  model: "llama3.1:latest",
  maxRetries: 2,
});

export async function iterativeRag(query: string) {
  const vectorStore = await PGVectorStore.initialize(embeddings, {
    pool: pool,
    tableName: "documents",
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "pagecontent",
      metadataColumnName: "metadata",
    },
  });

  const promptTemplate = PromptTemplate.fromTemplate(
    `Answer the question based only on the following context:
        {context}
        Question: {question}`
  );

  const chain = RunnableSequence.from([
    {
      context: async (input) => {
        const results = await vectorStore.similaritySearch(input.question, 4); // Retrieve top 4 similar documents
        return results.map((doc) => doc.pageContent).join("\n\n");
      },
      question: (input) => input.question,
    },
    promptTemplate,
    modelOllama,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke({ question: query });
  console.log(result);
  return result;
}
