# Architecture Overview - AI Study Assistant

AI Study Assistant is designed as a cloud-native, multi-tenant personalized education platform.

```mermaid
graph TD
    User[Student / User] --> NextUI[Next.js App Router UI - Light Theme]
    NextUI --> Auth[Microsoft Entra ID / Mock Auth]
    NextUI --> API[API Layer / Route Handlers]
    
    subgraph Core AI & Context Layer
        API --> Agent[AI Study Agent / Central Brain]
        Agent --> ContextEngine[Personalized Context Engine]
        ContextEngine --> RAG[RAG Pipeline / Hybrid Search]
        ContextEngine --> DB[(MySQL / SQLite DB)]
        Agent --> MCP[MCP Server Tools]
    End

    subgraph Service Adapters (lib/azure)
        RAG --> SearchAdapter[Azure AI Search / Hybrid Vector Search]
        RAG --> DocAdapter[Document Intelligence / PDF Parser]
        Agent --> AIAdapter[Azure Foundry / OpenAI LLM]
        API --> VoiceAdapter[Azure Speech STT/TTS]
    End
```

## Core Architectural Pillars
1. **Light Theme Design System**: Built with modern SaaS typography, high contrast readable text, and spacious layouts (`#F8FAFC` page, `#FFFFFF` cards, `#2563EB` blue accent).
2. **Central AI Brain**: `StudyAgent` handles natural query understanding, tool invocation, context synthesis, and grounded explanations.
3. **Multi-Tenant Security**: Vector search and database queries are strictly filtered by authenticated `userId`.
4. **Mock/Azure Dual Mode**: Pluggable provider abstraction switching seamlessly via `AI_PROVIDER=mock|azure`.
