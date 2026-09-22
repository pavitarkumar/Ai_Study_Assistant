export interface RoadmapSection {
  phase: string;
  duration: string;
  focus: string;
  topics: string[];
  projects?: string[];
}

export interface RoadmapResult {
  title: string;
  description: string;
  prerequisites: string[];
  estimatedTotalTime: string;
  phases: RoadmapSection[];
  capstoneProjects: string[];
  proTips: string[];
}

const ROADMAP_PRESETS: Record<string, RoadmapResult> = {
  'full stack': {
    title: 'Full Stack Web Development Roadmap (MERN / Next.js Stack)',
    description: 'A comprehensive, industry-standard roadmap to go from beginner to production-ready Full Stack Web Developer.',
    prerequisites: ['Basic computer literacy', 'Problem-solving mindset', 'Text editor (VS Code)'],
    estimatedTotalTime: '6 to 8 Months (15-20 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Web Fundamentals & Modern CSS',
        duration: 'Weeks 1 - 4',
        focus: 'Mastering document structure, styling, and responsive layout systems',
        topics: [
          'HTML5 semantic elements, accessibility (a11y), and SEO basics',
          'CSS3 Box Model, Flexbox, CSS Grid, and responsive media queries',
          'Modern styling with Tailwind CSS & CSS Modules',
          'Git & GitHub: Branching, commits, pull requests, and collaboration',
        ],
        projects: ['Responsive portfolio landing page', 'Accessible e-commerce product card grid'],
      },
      {
        phase: 'Phase 2: JavaScript Mastery (Core to Async)',
        duration: 'Weeks 5 - 10',
        focus: 'Deep dive into language mechanics, DOM manipulation, and asynchronous programming',
        topics: [
          'Variables (let/const), scope, closures, and hoisting',
          'Data structures: Arrays, Objects, Maps, Sets, and modern ES6+ methods',
          'Asynchronous JS: Event Loop, Callbacks, Promises, and Async/Await',
          'Fetch API, RESTful HTTP methods, status codes, and error handling',
          'DOM event delegation, local storage, and client-side form validation',
        ],
        projects: ['Interactive Task/Kanban board with LocalStorage', 'Weather dashboard using external REST API'],
      },
      {
        phase: 'Phase 3: Frontend Frameworks (React & Next.js)',
        duration: 'Weeks 11 - 16',
        focus: 'Component-driven architecture, state management, and Server-Side Rendering',
        topics: [
          'React 18 fundamentals: JSX, Props, State, and Component Lifecycle',
          'Essential Hooks: useState, useEffect, useRef, useMemo, useCallback',
          'Client-side state management (Zustand / Redux Toolkit / React Query)',
          'TypeScript with React: Strict typing, interfaces, and generic components',
          'Next.js 14 App Router: Server Components (RSC), SSR, SSG, and Route Handlers',
        ],
        projects: ['Full-featured E-Commerce Storefront with shopping cart', 'Social feed / Community blog with markdown rendering'],
      },
      {
        phase: 'Phase 4: Backend Engineering, APIs & Databases',
        duration: 'Weeks 17 - 22',
        focus: 'Server architecture, REST/GraphQL APIs, database modeling, and authentication',
        topics: [
          'Node.js runtime & Express.js / Next.js API Routes',
          'Relational Databases (PostgreSQL / MySQL) with Prisma ORM',
          'NoSQL Databases (MongoDB) & schema modeling with Mongoose',
          'Authentication & Security: JWT, HTTP-Only cookies, OAuth2 / NextAuth, bcrypt password hashing',
          'API Security: Rate limiting, CORS, input validation (Zod), and sanitization',
        ],
        projects: ['Authentication & User Management Microservice', 'Multi-tenant Study Assistant with REST API backend'],
      },
      {
        phase: 'Phase 5: Production, DevOps & System Design',
        duration: 'Weeks 23 - 28',
        focus: 'Containerization, CI/CD, cloud deployment, and scalability',
        topics: [
          'Docker containerization: Dockerfile, multi-stage builds, and Docker Compose',
          'Cloud deployment: Vercel, AWS (EC2/S3) or Render, with custom domain setup',
          'CI/CD automation with GitHub Actions (lint, test, build, deploy)',
          'Caching strategies with Redis & database indexing for query performance',
          'Basic system design: Load balancing, horizontal scaling, and microservices vs monolith',
        ],
        projects: ['Complete SaaS application with Stripe billing and automated CI/CD pipeline'],
      },
    ],
    capstoneProjects: [
      'Full-Stack AI SaaS with authentication, Stripe subscriptions, and PostgreSQL database',
      'Real-Time Collaborative Workspace (like Notion or Slack) with WebSockets & Redis',
    ],
    proTips: [
      'Do not get stuck in tutorial hell; build your own projects without following tutorials step-by-step.',
      'Always learn TypeScript early—over 90% of modern enterprise teams require it.',
      'Write clean, readable code and document your Git commits professionally.',
    ],
  },
  dsa: {
    title: 'Data Structures & Algorithms (DSA) Mastery Roadmap',
    description: 'A structured algorithmic roadmap designed for technical coding interviews (FAANG / Product Companies).',
    prerequisites: ['Proficiency in one programming language (C++, Java, or Python)'],
    estimatedTotalTime: '4 to 6 Months (12-15 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Foundations & Mathematical Complexity',
        duration: 'Weeks 1 - 3',
        focus: 'Asymptotic notation, basic problem solving, and language STL/Collections',
        topics: [
          'Big-O notation: Time and Auxiliary Space Complexity analysis',
          'Master theorem & recurrence relations',
          'C++ STL (vector, map, set, unordered_map) or Java Collections / Python collections',
          'Bit manipulation & basic number theory (primes, GCD, modular arithmetic)',
        ],
        projects: ['Custom dynamic array and string manipulation utilities'],
      },
      {
        phase: 'Phase 2: Linear Data Structures & Essential Patterns',
        duration: 'Weeks 4 - 8',
        focus: 'Arrays, Two Pointers, Sliding Window, Linked Lists, Stacks, and Queues',
        topics: [
          'Arrays & Strings: Two Pointer pattern, Sliding Window, Prefix Sums, Kadane\'s Algorithm',
          'Searching & Sorting: Binary Search on arrays and answer spaces, QuickSort, MergeSort',
          'Linked Lists: Fast & Slow pointers, reversing in-place, cycle detection, LRU Cache design',
          'Stacks & Queues: Monotonic Stack (Next Greater Element), Parentheses matching, Deque',
        ],
        projects: ['LRU Cache implementation with O(1) get and put', 'Expression evaluator and calculator'],
      },
      {
        phase: 'Phase 3: Hierarchical & Non-Linear Structures',
        duration: 'Weeks 9 - 14',
        focus: 'Recursion, Binary Trees, BSTs, Heaps, and Backtracking',
        topics: [
          'Recursion & Backtracking: Subsets, Permutations, N-Queens, Sudoku solver',
          'Binary Trees: DFS (Pre, In, Post), BFS Level-order, Height, Diameter, LCA',
          'Binary Search Trees (BST): Validation, Insertion, Deletion, Floor/Ceil, Kth smallest',
          'Heaps / Priority Queues: Top-K elements, Median in a stream, Merge K sorted lists',
        ],
        projects: ['Huffman coding compression tool', 'Custom min-heap and priority scheduling simulator'],
      },
      {
        phase: 'Phase 4: Graphs & Advanced Traversal',
        duration: 'Weeks 15 - 19',
        focus: 'Graph representations, traversal algorithms, and shortest path techniques',
        topics: [
          'Graph representations: Adjacency list and matrix',
          'Traversals: BFS, DFS, Connected components, Bipartite check, Cycle detection',
          'Topological Sort: Kahn’s Algorithm (BFS) and DFS with indegree tracking',
          'Shortest Paths: Dijkstra’s Algorithm, Bellman-Ford, Floyd-Warshall',
          'Disjoint Set Union (DSU) & Minimum Spanning Tree (Kruskal’s & Prim’s)',
        ],
        projects: ['Network routing simulator using Dijkstra\'s shortest path'],
      },
      {
        phase: 'Phase 5: Dynamic Programming & Interview Prep',
        duration: 'Weeks 20 - 26',
        focus: '1D/2D Dynamic Programming, Memoization vs Tabulation, and Mock Interviews',
        topics: [
          '1D DP: Climbing stairs, Frog jump, House robber, Coin change',
          '2D DP & Grids: Minimum path sum, Unique paths, 0/1 Knapsack problem',
          'Strings DP: Longest Common Subsequence (LCS), Edit Distance, Palindromic substrings',
          'DP on Subsequences & Bitmasking introduction',
          'Timed mock contests: LeetCode NeetCode 150 / Striver SDE Sheet revision',
        ],
        projects: ['Solving 150+ curated interview problems with clean GitHub writeups'],
      },
    ],
    capstoneProjects: [
      'NeetCode 150 / Blind 75 completion with written explanations and complexity proofs',
      'Automated Contest Tracker & Problem Solving Analytics CLI',
    ],
    proTips: [
      'Focus on pattern recognition (e.g. Sliding Window, Two Pointers, Monotonic Stack) instead of memorizing specific problems.',
      'Always speak your thought process aloud while practicing, as you will need to do so in live interviews.',
      'Analyze both Best, Average, and Worst-case time and space complexities for every solution.',
    ],
  },
  frontend: {
    title: 'Frontend Developer Roadmap (Modern Web & React Ecosystem)',
    description: 'Step-by-step roadmap to become a high-impact Frontend Software Engineer.',
    prerequisites: ['Basic HTML/CSS understanding', 'Browser dev tools familiarity'],
    estimatedTotalTime: '4 to 6 Months (15 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: HTML5, Modern CSS & UI Foundations',
        duration: 'Weeks 1 - 4',
        focus: 'Semantic HTML, responsive CSS, flexbox/grid, and Tailwind CSS',
        topics: ['Semantic markup, a11y, ARIA', 'Flexbox & CSS Grid in-depth', 'Tailwind CSS, animations, and transitions', 'Responsive design & mobile-first mindset'],
        projects: ['Pixel-perfect clone of a landing page (e.g. Stripe or Apple)', 'Responsive modern dashboard UI'],
      },
      {
        phase: 'Phase 2: Deep JavaScript & DOM Mechanics',
        duration: 'Weeks 5 - 10',
        focus: 'ES6+, Async programming, event handling, and APIs',
        topics: ['Scope, closures, prototype chain, `this` keyword', 'Array methods (map, filter, reduce), Object destructuring', 'Promises, Async/Await, and Fetch API', 'Browser storage (LocalStorage, SessionStorage, IndexedDB)'],
        projects: ['Interactive Kanban board', 'Searchable movie database using TMDB API'],
      },
      {
        phase: 'Phase 3: React 18 & TypeScript',
        duration: 'Weeks 11 - 16',
        focus: 'Component architecture, Hooks, TypeScript strictness, and state management',
        topics: ['JSX, Component decomposition, Virtual DOM', 'Hooks: useState, useEffect, useRef, useMemo, useCallback', 'TypeScript with React: Generics, Props interfaces, event types', 'Global state: Zustand or Redux Toolkit, TanStack Query (React Query)'],
        projects: ['Multi-step checkout application with form validation (Zod + React Hook Form)', 'Real-time collaborative chat UI'],
      },
      {
        phase: 'Phase 4: Next.js & Frontend Performance',
        duration: 'Weeks 17 - 22',
        focus: 'Server Components, SSR/SSG, Core Web Vitals, and Webpack/Vite optimization',
        topics: ['Next.js 14 App Router: Server vs Client Components', 'Routing, dynamic segments, parallel routes, and middleware', 'Core Web Vitals (LCP, FID, CLS) and image/font optimization', 'Testing with Vitest, React Testing Library, and Playwright'],
        projects: ['High-performance E-commerce catalog with Next.js & Tailwind CSS'],
      },
    ],
    capstoneProjects: [
      'Interactive Design System & Component Library published on npm',
      'Production SaaS dashboard with live analytics charts and authentication',
    ],
    proTips: [
      'Master Chrome DevTools: Performance tab, Network waterfall, and Lighthouse audits.',
      'Accessibility (a11y) is a major differentiator in senior frontend interviews.',
    ],
  },
  backend: {
    title: 'Backend Engineering Roadmap (APIs, Databases & Scalability)',
    description: 'Complete path to becoming a scalable Backend Engineer capable of building robust server systems.',
    prerequisites: ['Basic programming knowledge in JS/TS, Python, or Java'],
    estimatedTotalTime: '5 to 7 Months (15-20 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Server Runtime & Core APIs',
        duration: 'Weeks 1 - 5',
        focus: 'HTTP protocol, REST principles, and server runtime fundamentals',
        topics: ['HTTP methods, headers, status codes, and cookies', 'Node.js / Express or Python FastAPI / Java Spring Boot', 'RESTful API design and API contracts (Swagger/OpenAPI)', 'Input validation, sanitization, and centralized error handling middleware'],
        projects: ['Full CRUD REST API with authentication and input validation'],
      },
      {
        phase: 'Phase 2: Databases & ORM Architecture',
        duration: 'Weeks 6 - 11',
        focus: 'Relational vs NoSQL modeling, indexes, and queries',
        topics: ['PostgreSQL / MySQL: Joins, indexes, transactions (ACID), constraints', 'MongoDB / Document databases: Embedding vs Referencing, aggregation pipelines', 'ORMs: Prisma, TypeORM, or SQLAlchemy', 'Database migrations and schema evolution'],
        projects: ['Inventory & Order processing database schema with transactions'],
      },
      {
        phase: 'Phase 3: Authentication, Security & Caching',
        duration: 'Weeks 12 - 16',
        focus: 'OAuth, JWT, Redis caching, and defensive security',
        topics: ['Authentication: JWT tokens, refresh token rotation, OAuth 2.0', 'Redis caching: In-memory cache, cache invalidation, rate limiting', 'Security: OWASP Top 10, SQL injection prevention, CORS, CSRF, helmet headers', 'Background jobs: BullMQ, Celery, or worker queues'],
        projects: ['High-throughput URL shortener with Redis caching and rate limiting'],
      },
      {
        phase: 'Phase 4: Microservices, Message Brokers & Cloud',
        duration: 'Weeks 17 - 24',
        focus: 'Event-driven systems, Docker, message queues, and deployment',
        topics: ['Docker containerization & multi-stage Dockerfiles', 'Message brokers: RabbitMQ, Apache Kafka, or AWS SQS', 'WebSockets & Server-Sent Events (SSE) for real-time messaging', 'Cloud deployment on AWS/GCP, reverse proxies (Nginx), and CI/CD pipelines'],
        projects: ['Event-driven notification and payment processing microservice'],
      },
    ],
    capstoneProjects: [
      'Scalable Distributed E-Commerce Backend with Redis cache, Kafka message queue, and PostgreSQL',
      'Real-Time WebSocket Gaming or Chat Server with horizontal scaling',
    ],
    proTips: [
      'Understand database indexing deeply—knowing when and why an index works solves 80% of backend latency issues.',
      'Learn how to write automated integration tests with supertest or testcontainers.',
    ],
  },
  'ai': {
    title: 'Artificial Intelligence & Machine Learning Roadmap',
    description: 'Roadmap from Python & Math foundations to Deep Learning, LLMs, RAG, and AI Agents.',
    prerequisites: ['High school calculus & linear algebra', 'Basic programming skills'],
    estimatedTotalTime: '6 to 9 Months (15-20 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Python, Linear Algebra & Statistics',
        duration: 'Weeks 1 - 6',
        focus: 'Mathematical foundations and data manipulation libraries',
        topics: ['Linear algebra: Vectors, matrices, dot products, eigenvalues', 'Calculus & probability: Derivatives, gradients, probability distributions', 'NumPy: Vectorization, broadcasting, and matrix math', 'Pandas & Matplotlib/Seaborn: Data wrangling and visualization'],
        projects: ['Exploratory Data Analysis (EDA) on real-world datasets'],
      },
      {
        phase: 'Phase 2: Classical Machine Learning',
        duration: 'Weeks 7 - 13',
        focus: 'Supervised and unsupervised learning algorithms with Scikit-Learn',
        topics: ['Supervised: Linear/Logistic regression, Decision Trees, Random Forests, XGBoost', 'Unsupervised: K-Means clustering, PCA (Principal Component Analysis)', 'Model evaluation: Precision, Recall, F1-Score, ROC-AUC, cross-validation', 'Feature engineering and pipeline construction'],
        projects: ['Housing price prediction model with feature engineering', 'Customer churn classification model'],
      },
      {
        phase: 'Phase 3: Deep Learning & Neural Networks',
        duration: 'Weeks 14 - 20',
        focus: 'Neural networks, backpropagation, and PyTorch',
        topics: ['Perceptrons, activation functions (ReLU, Sigmoid, Softmax), loss functions', 'Backpropagation and Gradient Descent optimizers (Adam, SGD)', 'PyTorch core: Tensors, Autograd, `nn.Module`, Dataset & DataLoader', 'Convolutional Neural Networks (CNNs) for Computer Vision', 'Recurrent Neural Networks (RNNs) & LSTMs for sequences'],
        projects: ['Image classification using transfer learning (ResNet)', 'Sentiment analysis classifier in PyTorch'],
      },
      {
        phase: 'Phase 4: Generative AI, Transformers, LLMs & Agents',
        duration: 'Weeks 21 - 28',
        focus: 'Transformer architecture, Embeddings, RAG, and Autonomous Agents',
        topics: ['Transformer architecture: Self-Attention, Multi-Head Attention, Positional Encoding', 'Hugging Face ecosystem: Tokenizers, fine-tuning with PEFT/LoRA', 'Retrieval-Augmented Generation (RAG): Vector databases (Pinecone, Chroma, Azure AI Search), chunking, hybrid search', 'Building AI Agents: Function calling, ReAct prompting, LangChain / LlamaIndex / MCP protocols'],
        projects: ['Domain-specific RAG Chatbot with semantic document citations', 'Autonomous Multi-tool AI Research Assistant'],
      },
    ],
    capstoneProjects: [
      'End-to-End Enterprise RAG Knowledge Platform with vector embeddings and multi-tenant isolation',
      'Fine-tuned Specialized LLM deployed via FastAPI and Docker with streaming UI',
    ],
    proTips: [
      'Do not skip mathematics; understanding gradient descent and vectors is what separates real ML engineers from prompt wrappers.',
      'Get hands-on with PyTorch early—it is the de facto standard in industry and research.',
    ],
  },
  devops: {
    title: 'DevOps & Cloud Engineering Roadmap',
    description: 'Path from Linux and automation to Kubernetes, CI/CD, Infrastructure as Code, and Cloud Architecture.',
    prerequisites: ['Basic command line familiarity', 'Basic networking understanding'],
    estimatedTotalTime: '5 to 7 Months (15 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Linux, Shell Scripting & Networking',
        duration: 'Weeks 1 - 4',
        focus: 'Operating systems, Bash automation, and network fundamentals',
        topics: ['Linux CLI, file permissions, process management, and systemd', 'Bash scripting for automated tasks', 'Networking: TCP/IP, DNS, OSI Model, SSH, SSL/TLS, and reverse proxies (Nginx)', 'Git workflows and version control branching'],
        projects: ['Automated server backup and health monitoring bash script'],
      },
      {
        phase: 'Phase 2: Containerization with Docker',
        duration: 'Weeks 5 - 9',
        focus: 'Docker images, multi-stage builds, networking, and volumes',
        topics: ['Container concepts vs Virtual Machines', 'Writing efficient Dockerfiles and multi-stage builds', 'Docker volumes, networking, and environment variables', 'Docker Compose for multi-container orchestration'],
        projects: ['Containerized 3-tier application (React + Node + PostgreSQL) with Docker Compose'],
      },
      {
        phase: 'Phase 3: CI/CD & Cloud Providers (AWS / Azure)',
        duration: 'Weeks 10 - 15',
        focus: 'Continuous Integration/Deployment and Cloud infrastructure',
        topics: ['CI/CD pipelines with GitHub Actions / GitLab CI', 'Automated testing, linting, and container registry publishing (Docker Hub / ECR)', 'Cloud fundamentals: AWS (EC2, S3, IAM, VPC, RDS) or Azure (VM, Blob, Entra ID)', 'Security best practices: Principle of least privilege, secrets management'],
        projects: ['Fully automated zero-downtime CI/CD pipeline deploying to cloud on git push'],
      },
      {
        phase: 'Phase 4: Kubernetes & Infrastructure as Code (IaC)',
        duration: 'Weeks 16 - 22',
        focus: 'Orchestrating microservices at scale and automated infrastructure',
        topics: ['Kubernetes architecture: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets', 'Helm package manager for Kubernetes', 'Infrastructure as Code with Terraform: Providers, state management, modules', 'Observability & Monitoring: Prometheus, Grafana, and structured logging'],
        projects: ['Terraform script provisioning cloud cluster running Kubernetes microservices with Grafana dashboards'],
      },
    ],
    capstoneProjects: [
      'Production GitOps pipeline with ArgoCD and Kubernetes cluster on AWS/Azure',
      'Multi-region Terraform deployment with automated disaster recovery',
    ],
    proTips: [
      'Always automate through code; never configure cloud resources manually through the GUI in production.',
      'Learn Kubernetes by building from scratch on minikube/k3s before managing cloud EKS/AKS.',
    ],
  },
  python: {
    title: 'Python Developer & Software Engineer Roadmap',
    description: 'From syntax to professional software development, APIs, automation, and testing in Python.',
    prerequisites: ['Basic logical thinking and problem-solving desire'],
    estimatedTotalTime: '3 to 5 Months (12-15 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Python Core Foundations',
        duration: 'Weeks 1 - 3',
        focus: 'Syntax, control flow, functions, and built-in data structures',
        topics: ['Variables, types, operators, and string formatting (f-strings)', 'Lists, Tuples, Dictionaries, Sets, and list comprehensions', 'Functions, *args, **kwargs, lambda functions, and scope', 'Error handling: try-except-finally and custom exceptions'],
        projects: ['Command-line expense tracker with JSON file storage'],
      },
      {
        phase: 'Phase 2: Object-Oriented & Advanced Python',
        duration: 'Weeks 4 - 7',
        focus: 'Classes, dunder methods, generators, decorators, and memory',
        topics: ['OOP: Classes, Inheritance, Polymorphism, Encapsulation, and Abstract Base Classes', 'Dunder methods (`__init__`, `__str__`, `__repr__`, `__call__`)', 'Decorators and Generators with `yield`', 'Context managers (`with` statement) and `collections` module', 'Virtual environments (venv, poetry) and package management'],
        projects: ['Object-oriented Bank Management System with transaction logs'],
      },
      {
        phase: 'Phase 3: Web Frameworks & APIs (FastAPI)',
        duration: 'Weeks 8 - 12',
        focus: 'Building modern async APIs with FastAPI and databases',
        topics: ['FastAPI basics: Path parameters, query parameters, request bodies', 'Pydantic data validation and serialization', 'SQLAlchemy / SQLModel ORM with SQLite and PostgreSQL', 'Asynchronous endpoints (`async def`) and background tasks', 'JWT Authentication and password hashing with passlib/bcrypt'],
        projects: ['Production-ready REST API with JWT Auth and SQLite/PostgreSQL database'],
      },
      {
        phase: 'Phase 4: Automation, Testing & Deployment',
        duration: 'Weeks 13 - 16',
        focus: 'Web scraping, unit testing, Docker, and cloud deployment',
        topics: ['Web scraping with BeautifulSoup and Playwright/Selenium', 'Unit and integration testing with `pytest` and mock fixtures', 'Dockerizing Python applications with multi-stage builds', 'Deploying to cloud platforms (Render, Railway, or AWS EC2)'],
        projects: ['Automated price comparison web scraper with daily email reports'],
      },
    ],
    capstoneProjects: [
      'Full-Stack AI Application with FastAPI backend, Next.js frontend, and PostgreSQL',
      'High-Performance Async Data Processing Pipeline with PyTest suite',
    ],
    proTips: [
      'Write Pythonic code: Read and follow PEP 8 style guidelines.',
      'Use type hints (`from typing import List, Dict, Optional`) on all functions for maintainability.',
    ],
  },
  java: {
    title: 'Java Developer & Spring Boot Enterprise Roadmap',
    description: 'Complete path from Core Java to Spring Boot microservices, JPA/Hibernate, and enterprise systems.',
    prerequisites: ['Basic understanding of programming fundamentals'],
    estimatedTotalTime: '5 to 7 Months (15-20 hrs/week)',
    phases: [
      {
        phase: 'Phase 1: Core Java & OOP Principles',
        duration: 'Weeks 1 - 5',
        focus: 'JVM architecture, syntax, OOP pillars, and exception handling',
        topics: ['JDK vs JRE vs JVM internals and Bytecode compilation', 'Strict OOP: Classes, Encapsulation, Inheritance, Polymorphism, Abstraction', 'Interfaces, Abstract Classes, and access modifiers', 'Exception handling and custom exception hierarchies', 'Java Memory Model: Heap, Stack, Metaspace, and Garbage Collection'],
        projects: ['Console Student Management System with file persistence'],
      },
      {
        phase: 'Phase 2: Java Collections & Multithreading',
        duration: 'Weeks 6 - 10',
        focus: 'Collections framework, Java 8+ features, and concurrency',
        topics: ['Collections Framework: List (ArrayList, LinkedList), Set (HashSet, TreeSet), Map (HashMap, TreeMap)', 'Java 8+ Lambdas, Functional Interfaces, and Stream API', 'Generics and type safety', 'Multithreading: Thread class, Runnable, synchronization, locks, and ExecutorService'],
        projects: ['Multi-threaded file processing simulator using ThreadPoolExecutor'],
      },
      {
        phase: 'Phase 3: Spring Boot & Data Persistence',
        duration: 'Weeks 11 - 16',
        focus: 'Dependency Injection, Spring MVC REST APIs, and JPA/Hibernate',
        topics: ['Spring Core: Inversion of Control (IoC) and Dependency Injection (DI)', 'Spring Boot starter, annotations (`@RestController`, `@Service`, `@Repository`)', 'Spring Data JPA & Hibernate: Entities, relationships (`@OneToMany`), queries, pagination', 'Database integration with PostgreSQL/MySQL and Flyway migrations'],
        projects: ['Enterprise E-commerce Product Catalog REST API with Spring Data JPA'],
      },
      {
        phase: 'Phase 4: Security, Microservices & Enterprise Cloud',
        duration: 'Weeks 17 - 24',
        focus: 'Spring Security, Microservices architecture, Docker, and Kafka',
        topics: ['Spring Security 6: JWT authentication, role-based access control (RBAC)', 'Microservices concepts: Service discovery (Eureka), API Gateway, Feign clients', 'Message queues: Apache Kafka or RabbitMQ for inter-service communication', 'Unit and integration testing with JUnit 5 and Mockito', 'Dockerizing Spring Boot jars and deployment'],
        projects: ['Distributed Microservices Banking System with JWT Security and Kafka events'],
      },
    ],
    capstoneProjects: [
      'Production Banking / Payment Microservice Architecture with Spring Security and PostgreSQL',
      'Event-Driven Order Processing System with Spring Cloud and Apache Kafka',
    ],
    proTips: [
      'Master the Stream API and functional programming in Java 8+; it makes code 10x cleaner.',
      'Understand how Hibernate creates SQL queries behind the scenes to avoid N+1 query performance traps.',
    ],
  },
};

export function formatRoadmapMarkdown(roadmap: RoadmapResult): string {
  let md = `## 🗺️ ${roadmap.title}\n\n`;
  md += `> ${roadmap.description}\n\n`;
  md += `⏱️ **Estimated Timeline**: \`${roadmap.estimatedTotalTime}\`\n\n`;

  if (roadmap.prerequisites && roadmap.prerequisites.length > 0) {
    md += `### 📋 Prerequisites & Recommendations\n`;
    roadmap.prerequisites.forEach(p => {
      md += `- [x] ${p}\n`;
    });
    md += `\n---\n\n`;
  }

  md += `### 🚀 Step-by-Step Learning Phases\n\n`;

  roadmap.phases.forEach((phase, idx) => {
    md += `#### ${phase.phase} (${phase.duration})\n`;
    md += `🎯 **Primary Focus**: *${phase.focus}*\n\n`;
    md += `**Key Topics & Skills to Master:**\n`;
    phase.topics.forEach(t => {
      md += `- 🔹 **${t}**\n`;
    });

    if (phase.projects && phase.projects.length > 0) {
      md += `\n**🛠️ Milestone Projects:**\n`;
      phase.projects.forEach(proj => {
        md += `- 💻 \`${proj}\`\n`;
      });
    }
    md += `\n---\n\n`;
  });

  if (roadmap.capstoneProjects && roadmap.capstoneProjects.length > 0) {
    md += `### 🏆 Capstone Portfolio Projects\n`;
    roadmap.capstoneProjects.forEach((cap, i) => {
      md += `${i + 1}. **${cap}**\n`;
    });
    md += `\n`;
  }

  if (roadmap.proTips && roadmap.proTips.length > 0) {
    md += `### 💡 Pro Tips for Success\n`;
    roadmap.proTips.forEach(tip => {
      md += `- ⭐ ${tip}\n`;
    });
    md += `\n`;
  }

  md += `> **Next Step**: Choose Phase 1, start building today's scheduled tasks, and ask me to create a practice quiz on any phase whenever you're ready!`;

  return md;
}

export function generateCustomRoadmap(topicName: string): RoadmapResult {
  const clean = topicName.replace(/[^\w\s\+\#]/gi, '').trim();
  const formatted = clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Technology & Computer Science';

  return {
    title: `${formatted} Complete Learning Roadmap`,
    description: `A structured, step-by-step curriculum to master ${formatted} from foundational principles to production-level proficiency.`,
    prerequisites: [
      `Basic problem-solving mindset`,
      `Development environment configured for ${formatted}`,
      `Commitment to daily hands-on practice (1-2 hours/day)`,
    ],
    estimatedTotalTime: '4 to 6 Months (10-15 hrs/week)',
    phases: [
      {
        phase: `Phase 1: Foundations & Architecture of ${formatted}`,
        duration: 'Month 1 (Weeks 1 - 4)',
        focus: `Mastering syntax, core principles, mental models, and environment setup for ${formatted}`,
        topics: [
          `Core philosophy, history, and runtime mechanics of ${formatted}`,
          `Essential syntax, variables, data types, and control structures`,
          `Memory layout, compilation vs interpretation, and standard libraries`,
          `Setting up developer tooling, linters, debuggers, and version control (Git)`,
        ],
        projects: [`CLI application demonstrating fundamental data handling in ${formatted}`],
      },
      {
        phase: `Phase 2: Core Patterns, Data Structures & Best Practices`,
        duration: 'Month 2 (Weeks 5 - 8)',
        focus: `Writing idiomatic, clean code and applying standard design patterns in ${formatted}`,
        topics: [
          `Idiomatic programming paradigms (OOP / Functional / Imperative) in ${formatted}`,
          `Handling errors, exceptions, validation, and defensive programming`,
          `Working with file I/O, serialization (JSON/YAML), and network requests`,
          `Asynchronous execution, concurrency, and event-driven patterns in ${formatted}`,
        ],
        projects: [`Interactive data manager and utility library using ${formatted}`],
      },
      {
        phase: `Phase 3: Advanced Frameworks, Ecosystem & Libraries`,
        duration: 'Month 3 (Weeks 9 - 12)',
        focus: `Industry-standard frameworks, ecosystem tools, and database persistence`,
        topics: [
          `The dominant industry framework and ecosystem tools for ${formatted}`,
          `Connecting to databases (SQL/NoSQL) and data persistence layers`,
          `REST / GraphQL API design and secure network communication`,
          `State management, dependency injection, and modular software packaging`,
        ],
        projects: [`Full-featured API service or client application built with ${formatted}`],
      },
      {
        phase: `Phase 4: Production Engineering, Testing & Performance`,
        duration: 'Month 4 (Weeks 13 - 16)',
        focus: `Optimization, automated testing, containerization, and enterprise deployment`,
        topics: [
          `Automated unit testing, integration testing, and test coverage analysis`,
          `Profiling CPU, memory leaks, and optimizing runtime bottlenecks in ${formatted}`,
          `Containerizing applications with Docker for reproducible builds`,
          `Setting up CI/CD automation and deploying to cloud infrastructure`,
        ],
        projects: [`Production-ready service with automated CI/CD pipeline and automated test suite`],
      },
      {
        phase: `Phase 5: Portfolio Capstones & Interview Preparation`,
        duration: 'Month 5 (Weeks 17 - 20)',
        focus: `Real-world portfolio showcase, system architecture, and technical interview mastery`,
        topics: [
          `Deep architectural deep-dive into internals and advanced language quirks`,
          `System design principles and high-throughput architectural trade-offs`,
          `Open-source contributions and portfolio documentation`,
          `Live coding challenges, interview problem sets, and technical mock interviews`,
        ],
        projects: [`Flagship capstone project solving a genuine real-world problem`],
      },
    ],
    capstoneProjects: [
      `End-to-End Enterprise Solution built with ${formatted} and deployed with cloud CI/CD`,
      `Open-source utility or framework plugin published to the community registry`,
    ],
    proTips: [
      `Build real projects early—reading documentation without coding leads to shallow knowledge.`,
      `Study open-source repositories written in ${formatted} to observe how experienced engineers structure code.`,
      `Practice explaining architectural decisions and trade-offs clearly.`,
    ],
  };
}

export function getRoadmapForQuery(query: string): string | null {
  const qLower = query.toLowerCase().trim();

  const isRoadmapQuery =
    qLower.includes('roadmap') ||
    qLower.includes('road map') ||
    qLower.includes('learning path') ||
    qLower.includes('curriculum') ||
    qLower.includes('step by step guide to learn') ||
    qLower.includes('how to learn') ||
    qLower.includes('how to become a') ||
    qLower.includes('guide to become') ||
    qLower.includes('study path') ||
    qLower.includes('learning track');

  if (!isRoadmapQuery) return null;

  // Check presets
  if (qLower.includes('full stack') || qLower.includes('fullstack') || qLower.includes('mern') || qLower.includes('web development') || qLower.includes('web dev')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['full stack']);
  }
  if (qLower.includes('dsa') || qLower.includes('data structure') || qLower.includes('algorithms') || qLower.includes('algorithm') || qLower.includes('competitive programming')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['dsa']);
  }
  if (qLower.includes('frontend') || qLower.includes('front end') || qLower.includes('react')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['frontend']);
  }
  if (qLower.includes('backend') || qLower.includes('back end')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['backend']);
  }
  if (qLower.includes('ai') || qLower.includes('machine learning') || qLower.includes('artificial intelligence') || qLower.includes('deep learning') || qLower.includes('data science')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['ai']);
  }
  if (qLower.includes('devops') || qLower.includes('cloud') || qLower.includes('kubernetes') || qLower.includes('docker')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['devops']);
  }
  if (qLower.includes('python')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['python']);
  }
  if (qLower.includes('java') || qLower.includes('spring')) {
    return formatRoadmapMarkdown(ROADMAP_PRESETS['java']);
  }

  // Extract topic from query (e.g. "roadmap for golang", "roadmap to learn cybersecurity")
  const extractedTopic = qLower
    .replace(/(give me a|give me|show me|provide a|provide|can you give|create a|create|generate|tell me about|what is the)?\s*(roadmap|road map|learning path|curriculum|step by step guide to learn|how to learn|how to become a|guide to become|study path)\s*(for|of|to learn|in|to become a|to become)?/gi, '')
    .replace(/[\?\.\!]+$/, '')
    .trim();

  const finalTopic = extractedTopic || 'Software Development';
  const customRoadmap = generateCustomRoadmap(finalTopic);
  return formatRoadmapMarkdown(customRoadmap);
}
