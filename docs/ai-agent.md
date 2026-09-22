# AI Agent Architecture

The **Central Study Agent** (`lib/ai/agent.ts`) acts as the orchestrator for the entire platform.

```mermaid
graph TD
    UserQuery[Student Prompt] --> Agent[Study Agent]
    Agent --> ContextEngine[Personalized Context Engine]
    ContextEngine --> Profile[Profile & Weak Topics]
    ContextEngine --> RAG[RAG Vector Search]
    
    Agent --> ToolSelection{Tool Selection}
    ToolSelection -->|Progress Check| getStudentProgress
    ToolSelection -->|Weak Topics| getWeakTopics
    ToolSelection -->|Study Plan| getStudyPlan
    ToolSelection -->|Document Search| searchKnowledge
    
    ToolSelection --> Synthesizer[LLM Grounded Synthesis]
    Synthesizer --> Output[Formatted Markdown + Citations]
```

## Available Agent Tools
- `searchKnowledge`: Hybrid RAG document retrieval.
- `getStudentProgress`: Returns study time, streak, and accuracy metrics.
- `getWeakTopics`: Fetches topics with mastery <65%.
- `getStrongTopics`: Fetches topics with mastery >=75%.
- `getStudyPlan`: Retrieves scheduled daily study tasks.
- `generateQuiz`: Creates adaptive quizzes.
- `recordStudySession`: Logs study minutes.
- `webSearch`: Standard web information reference.
