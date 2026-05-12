import { QdrantVectorStore } from "@langchain/qdrant";
import type { Embeddings } from "@langchain/core/embeddings";
import type { Document } from "@langchain/core/documents";

export async function storeDocumentsInQdrant(
  docs: Document[],
  embeddings: Embeddings
) {
  const vectorStore = await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "pdf-docs",
    }
  );

  return vectorStore;
}

export async function queryQdrant(query: string, embeddings: Embeddings) {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "pdf-docs",
    }
  );

  const results = await vectorStore.similaritySearch(query, 4);
  return results.map(doc => doc.pageContent).join("\n\n");
}