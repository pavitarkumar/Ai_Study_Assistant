# Security & Privacy Architecture

## Security Principles
1. **Multi-Tenant Document Isolation**: All RAG search requests explicitly filter by `userId eq '...'`. User A can never retrieve User B's documents.
2. **Prompt Injection Defense**: System prompts explicitly instruct the AI agent to treat uploaded document text as untrusted content and ignore inline instructions.
3. **Secret Protection**: API credentials are kept strictly in server-side environment variables and never leaked to the client bundle.
