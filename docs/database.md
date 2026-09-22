# Database Schema & Data Architecture

The platform supports:
- Local development via Prisma & SQLite (`prisma/schema.prisma`).
- Production Azure Database for MySQL (`database/schema.sql`).

## Core Relational Tables
- `users`: User identity and role (`Student` / `Admin`).
- `profiles`: Student learning level, goal, and bio.
- `topic_mastery`: Per-user topic mastery percentage tracking.
- `conversations` & `messages`: Chat history with JSON citations.
- `documents` & `document_chunks`: Document metadata and vector chunk references.
- `quiz_attempts` & `quiz_answers`: Quiz history and scoring metrics.
- `study_plans` & `study_plan_items`: Daily adaptive study schedules.
