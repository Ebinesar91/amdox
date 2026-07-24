import os
import math
from typing import List, Dict

# Standard In-Memory Lightweight Semantic Vector Store Fallback
class SimpleVectorStore:
    def __init__(self):
        self.documents = []
        self.vocab = set()

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in text.split() if w.isalnum()]

    def _tf(self, text: str) -> Dict[str, float]:
        tokens = self._tokenize(text)
        if not tokens:
            return {}
        counts = {}
        for t in tokens:
            counts[t] = counts.get(t, 0) + 1
        return {t: count / len(tokens) for t, count in counts.items()}

    def add_texts(self, texts: List[str], metadatas: List[dict]):
        for text, meta in zip(texts, metadatas):
            self.documents.append({"text": text, "metadata": meta})
            for token in self._tokenize(text):
                self.vocab.add(token)

    def similarity_search(self, query: str, k: int = 3) -> List[dict]:
        query_tf = self._tf(query)
        if not query_tf or not self.documents:
            return self.documents[:k]

        results = []
        for doc in self.documents:
            doc_tf = self._tf(doc["text"])
            
            # Compute cosine similarity
            dot_product = sum(query_tf.get(t, 0) * doc_tf.get(t, 0) for t in query_tf)
            q_norm = math.sqrt(sum(v**2 for v in query_tf.values()))
            d_norm = math.sqrt(sum(v**2 for v in doc_tf.values()))
            
            similarity = dot_product / (q_norm * d_norm) if (q_norm * d_norm) > 0 else 0
            results.append((similarity, doc))

        # Sort by highest similarity
        results.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for _, item in results[:k]]

# Initialize Vector Store
vector_store = SimpleVectorStore()

# Seed default ERP operational guidelines and financial policies
vector_store.add_texts(
    [
        "ERP Financial Policy: Invoices over $10,000 require manual CFO confirmation (Sarah Jenkins). Invoices under $10,000 can be approved by the Finance Manager.",
        "HR Operations Guideline: Staff leave requests must be submitted at least 5 business days in advance. Sick leave requires a medical certificate if extending beyond 3 days.",
        "SCM Logistics Standard: Reorder warning threshold for IT network components (SKUs 900-999) is set to 10 units. Safety stock buffers must hold 15% regional reserve.",
        "Project Management Policy: High-priority tasks (CRITICAL) must have resource loading allocations verified and FTE rates capped at 100% per fiscal cycle."
    ],
    [
        {"category": "finance", "source": "policy_fin_01.pdf"},
        {"category": "hr", "source": "guide_hr_02.pdf"},
        {"category": "scm", "source": "standard_scm_03.pdf"},
        {"category": "projects", "source": "policy_pm_04.pdf"}
    ]
)

def add_document(text: str, source: str, category: str):
    vector_store.add_texts([text], [{"category": category, "source": source}])

def query_knowledge_base(query: str, k: int = 2) -> List[dict]:
    return vector_store.similarity_search(query, k=k)
