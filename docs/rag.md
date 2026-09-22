# RAG Architecture & Multi-Tenant Isolation

## RAG Ingestion & Query Pipeline

```mermaid
graph LR
    Document[Uploaded PDF/DOCX] --> Blob[Azure Blob Storage]
    Blob --> DocIntel[Azure Document Intelligence]
    DocIntel --> Chunking[Text Chunking & Metadata]
    Chunking --> Embedding[Vector Embedding Model]
    Embedding --> SearchIndex[Azure AI Search Index]
    
    UserQuery[User Query] --> Agent[Study Agent]
    Agent --> HybridSearch[Azure AI Search Hybrid Retrieval]
    SearchIndex --> HybridSearch
    HybridSearch --> GroundedLLM[Azure Foundry Grounded LLM]
    GroundedLLM --> Response[Answer + Citations]
```

## Multi-Tenant Security Rules
Every vector search query sent to Azure AI Search or the local Mock Search Provider applies an explicit OData filter:
\`\`\`odata
userId eq 'user-demo-123'
\`\`\`
This prevents cross-user document retrieval leakage.
