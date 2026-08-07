import os
import logging
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from services.mock_db import KNOWLEDGE_DOCS

logger = logging.getLogger("zeno.vector_db")

class VectorDBService:
    def __init__(self):
        self.client: QdrantClient = None
        self.collection_name = "campus_knowledge"
        self._initialize_client()

    def _initialize_client(self):
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        try:
            # Try connecting to remote Qdrant with short timeout
            client = QdrantClient(url=qdrant_url, timeout=1.5, check_compatibility=False)
            client.get_collections()
            self.client = client
            logger.info(f"Connected to remote Qdrant at {qdrant_url}")
        except Exception as e:
            logger.warning(f"Remote Qdrant unavailable at {qdrant_url} ({e}). Falling back to QdrantClient(':memory:')")
            self.client = QdrantClient(":memory:", check_compatibility=False)
        
        self._seed_knowledge_base()

    def _generate_simple_embedding(self, text: str, dim: int = 128) -> List[float]:
        """Deterministic mock embedding for local RAG retrieval."""
        import hashlib
        words = text.lower().split()
        vector = [0.0] * dim
        for i, word in enumerate(words):
            h = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
            idx = h % dim
            vector[idx] += 1.0 / (i + 1)
        norm = sum(x*x for x in vector) ** 0.5
        if norm > 0:
            vector = [x / norm for x in vector]
        return vector

    def _seed_knowledge_base(self):
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=128, distance=Distance.COSINE)
                )
                points = []
                for idx, doc in enumerate(KNOWLEDGE_DOCS):
                    vector = self._generate_simple_embedding(doc["title"] + " " + doc["content"])
                    points.append(
                        PointStruct(
                            id=idx + 1,
                            vector=vector,
                            payload={"doc_id": doc["id"], "title": doc["title"], "content": doc["content"]}
                        )
                    )
                self.client.upsert(collection_name=self.collection_name, points=points)
                logger.info(f"Seeded {len(points)} knowledge documents into Qdrant collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Failed to seed Qdrant knowledge base: {e}")

    def search_knowledge(self, query: str, limit: int = 2) -> List[Dict[str, Any]]:
        try:
            query_vector = self._generate_simple_embedding(query)
            res = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                limit=limit
            )
            results = []
            points = getattr(res, "points", res)
            for hit in points:
                score = getattr(hit, "score", 0.9)
                payload = getattr(hit, "payload", {})
                results.append({
                    "score": round(float(score), 4),
                    "title": payload.get("title"),
                    "content": payload.get("content"),
                    "doc_id": payload.get("doc_id")
                })
            return results
        except Exception as e:
            logger.error(f"Qdrant search error: {e}")
            # Fallback direct text search
            results = []
            for doc in KNOWLEDGE_DOCS:
                if any(w.lower() in doc["content"].lower() or w.lower() in doc["title"].lower() for w in query.split()):
                    results.append({"score": 0.88, "title": doc["title"], "content": doc["content"], "doc_id": doc["id"]})
            return results[:limit]

# Singleton instance
vector_db = VectorDBService()
