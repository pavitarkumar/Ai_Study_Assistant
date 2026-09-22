# Azure Services Configuration & SDK Adapters

The application uses an adapter pattern located in `lib/azure/` to isolate Azure SDK calls from frontend components.

## Supported Services
1. **Microsoft Foundry / Azure OpenAI**: LLM completions (`lib/azure/foundry.ts`).
2. **Azure AI Search**: Hybrid keyword & vector search (`lib/azure/search.ts`).
3. **Azure Document Intelligence**: PDF/Doc parsing & structure extraction (`lib/azure/documentIntelligence.ts`).
4. **Azure Speech Service**: STT / TTS conversion (`lib/azure/speech.ts`).
5. **Azure Blob Storage**: Document file persistence (`lib/azure/config.ts`).
6. **Azure Database for MySQL**: Production relational data storage (`database/schema.sql`).
