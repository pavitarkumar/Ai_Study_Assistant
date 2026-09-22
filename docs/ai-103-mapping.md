# Azure AI-103 Exam Mapping

This project maps directly to the competencies measured in the **Microsoft Azure AI Engineer Associate (AI-103 / AI-102)** certifications:

| AI-103 Competency Area | Project Implementation | File Location |
| :--- | :--- | :--- |
| **Generative AI & LLMs** | Azure Foundry / OpenAI integration & grounded completions | `lib/azure/foundry.ts` |
| **AI Agents & Tool Calling** | Central AI Study Agent with tool orchestration | `lib/ai/agent.ts` |
| **Grounding & RAG** | Document RAG search pipeline with multi-tenant filters | `lib/ai/contextEngine.ts`, `lib/azure/search.ts` |
| **Vector & Hybrid Search** | Azure AI Search REST / SDK hybrid retrieval adapter | `lib/azure/search.ts` |
| **Model Context Protocol** | Custom TypeScript MCP server with tool definitions | `mcp-server/server.ts` |
| **Document Intelligence** | Automated PDF extraction & chunking pipeline | `lib/azure/documentIntelligence.ts` |
| **Speech Services** | Speech-to-Text & Text-to-Speech adapter abstraction | `lib/azure/speech.ts` |
| **Authentication & RBAC** | Entra ID architecture & user isolation controls | `lib/db/index.ts`, `database/schema.sql` |
| **Local / Mock Provider** | Out-of-the-box local mock mode for zero-cost dev | `lib/azure/config.ts` |
