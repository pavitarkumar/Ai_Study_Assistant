# AI Study Assistant

> A production-quality, personalized AI learning platform designed as an **Azure AI-103 Project & Portfolio Showcase**.

![Light Theme SaaS Design System](https://img.shields.io/badge/Theme-Clean_Light_SaaS-2563EB)
![Azure AI-103 Certified Architecture](https://img.shields.io/badge/Azure-AI--103_Ready-0078D4)
![Local Mock Provider Out Of Box](https://img.shields.io/badge/Mock_Mode-100%25_Functional-16A34A)

---

## 🌟 Product Vision

**AI Study Assistant** is a personalized AI learning platform where the **AI Study Chat** acts as the central brain. It understands:
- What the student is asking
- Their learning level & goals
- Weak topics (<65%) & strong topics (&ge;75%)
- Quiz accuracy & recent study activity
- Uploaded study material with exact citations

The interface is built strictly with a **Premium Light Theme SaaS Design System** (`#F8FAFC` page background, `#FFFFFF` cards, `#111827` primary text, `#2563EB` primary blue, rounded 14px borders, and soft shadows).

---

## 🚀 Key Features

1. **AI Study Chat (Central Brain)**:
   - 3-Column Desktop Layout: Conversation history, central markdown/math chat window, and right-side study context panel.
   - Quick Actions: "Explain Simpler", "Give Example", "Ask Me Questions", "Create Quiz".
2. **Personalized Context Engine**: `retrievePersonalizedContext(userId, query)` automatically fetches student profile, weak topics, and study plans.
3. **Multi-Tenant RAG Architecture**: Multi-tenant isolation enforcing `userId eq '...'` on every hybrid vector search query.
4. **Adaptive AI Quiz**: Configurable by topic, difficulty (Easy, Medium, Hard), question count, and types (MCQ, True/False, Scenario, Code Output).
5. **Dynamic Study Planner**: Generates daily schedules and adapts future tasks automatically when sessions are completed or missed.
6. **Voice Assistant**: Speech-to-Text -> AI Study Agent -> Text-to-Speech playback with clean visual state indicators (`Ready`, `Listening...`, `Processing...`, `Speaking...`).
7. **Model Context Protocol (MCP) Server**: Standalone MCP server exposing `get_student_progress`, `get_weak_topics`, `create_quiz`, etc.
8. **100% Out-of-the-Box Mock Mode**: Zero Azure credentials required for complete local testing (`AI_PROVIDER=mock`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend / Framework**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Math & Markdown**: `react-markdown`, `remark-math`, `rehype-katex`, `katex`.
- **Database**: SQLite / Prisma (`prisma/schema.prisma`) + MySQL Schema (`database/schema.sql`).
- **AI & RAG Providers**: Azure AI Foundry, Azure AI Search, Azure Document Intelligence, Azure Speech Services.
- **Protocol**: Model Context Protocol (`@modelcontextprotocol/sdk`).

---

## 💻 Quick Start & Setup

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Local Development Server
\`\`\`bash
npm run dev
\`\`\`
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Tests
\`\`\`bash
npm test
\`\`\`

### 4. Build Production Bundle
\`\`\`bash
npm run build
\`\`\`

---

## 📊 Demo Student Dataset

The application initializes with realistic pre-configured data for **Demo Student**:
- **Topics & Mastery**:
  - Arrays: 88%
  - Linked List: 76%
  - Stack: 82%
  - Queue: 79%
  - Trees: 61%
  - **Graphs**: 45% *(Identified as weak topic)*
  - **Dynamic Programming**: 35% *(Identified as weak topic)*
- **Stats**: Today's study time (45 min), Current streak (12 days), Quiz accuracy (82%), Goal progress (74%).

---

## 📁 Directory Structure

\`\`\`
app/
├── page.tsx                      # Premium Light Landing Page
├── dashboard/page.tsx             # Main Learning Dashboard
├── study/
│   ├── chat/page.tsx             # AI Study Chat (Central Brain)
│   ├── search/page.tsx           # Advanced Search Page
│   ├── documents/page.tsx        # My Documents RAG Upload
│   ├── quiz/page.tsx             # Adaptive AI Quiz Page
│   ├── planner/page.tsx          # Study Planner Page
│   └── tracker/page.tsx          # Study Tracker Page
├── progress/page.tsx             # Mastery & Insights Page
├── goals/page.tsx                # Study Goals Page
├── admin/page.tsx                # Admin Dashboard Page
└── api/                          # REST API Handlers

components/
├── layout/                       # Sidebar, TopNav, AppShell
└── voice/                        # Voice Assistant Modal

lib/
├── ai/                           # Agent & Personalized Context Engine
├── azure/                        # Azure SDK Adapters & Mock Providers
├── db/                           # Mock Data Store & Database Accessor
└── utils/                        # Utility Helpers

mcp-server/                       # Model Context Protocol Server

docs/                             # Architectural & Azure AI-103 Docs
\`\`\`

---

## 🎓 Azure AI-103 Certification Mapping

See [docs/ai-103-mapping.md](docs/ai-103-mapping.md) for full mapping of project modules to Microsoft AI-103 exam domains.
