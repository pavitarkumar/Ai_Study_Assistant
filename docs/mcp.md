# Model Context Protocol (MCP) Server

The **AI Study Assistant MCP Server** (`mcp-server/server.ts`) exposes student learning context tools using the official `@modelcontextprotocol/sdk`.

## Exposed Tools
1. `get_student_progress`: Returns progress metrics.
2. `get_weak_topics`: Returns weak topics (<65%).
3. `get_strong_topics`: Returns strong topics (>=75%).
4. `get_study_plan`: Returns active study schedule.
5. `create_quiz`: Generates topic quizzes.
6. `create_study_session`: Logs study time.

## Authorization & Security
Every tool invocation verifies `userId` authentication parameters. Attempting to execute tools without valid authorization produces an immediate exception.
