import { embeddings, pool } from "./config";

async function similaritySearch(query: string, k = 3) {
  const queryEmbedding = await embeddings.embedQuery(query);
  const vec = `[${queryEmbedding.join(",")}]`;
  const res = await pool.query(
    `SELECT pageContent FROM documents ORDER BY embedding <-> $1 LIMIT $2`,
    [vec, k]
  );

  return res.rows.map((r) => r.pagecontent);
}

export { similaritySearch };
