<h1 align="center">AI Usage & Contribution Report</h1>

<p align="center" style="margin: 15px;">
  <img src="https://img.shields.io/badge/Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white" alt="Cursor" />
  <img src="https://img.shields.io/badge/GitHub_Copilot-181717?style=for-the-badge&logo=github&logoColor=white" alt="Copilot" />
  <img src="https://img.shields.io/badge/ChatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white" alt="ChatGPT" />
  <img src="https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude" />
  <img src="https://img.shields.io/badge/Canva-00C4CC?style=for-the-badge&logo=canva&logoColor=white" alt="Canva" />
</p>

<p align="center">Transparent documentation of Artificial Intelligence tools used throughout the development lifecycle.</p>
<p align="center">🤖 Code Generation · 🐛 Debugging · 🏗️ Architecture · 📊 Presentations</p>

---

## Overview
This document outlines how Artificial Intelligence tools, Large Language Models (LLMs), and coding agents were leveraged during the development of our project. In accordance with academic guidelines, this file provides full transparency regarding the AI assistance used for code generation, architecture planning, testing, and documentation.

The goal was to use these tools responsibly and critically as modern developers, enhancing productivity while maintaining a deep understanding of the generated output.

## AI Tools & Models
We utilized a combination of specialized coding agents, conversational LLMs, and design AI tools:

### LLMs & Conversational AI
- **ChatGPT (OpenAI)** & **DeepSeek**: Used for complex logic, system architecture, and prompt engineering.
- **Claude AI**: Used for advanced reasoning and structuring complex backend workflows.

### Coding Agents
- **Cursor AI Agent**: Main IDE agent used for active codebase generation, testing, and deployment.
- **GitHub Copilot**: In-editor AI pair programmer for auto-completion and inline debugging.

### Design & Presentations
- **Canva** & **Gamma AI**: Used to generate layouts, reports, and presentation slide decks for the project defense.

## AI-Assisted Tasks
We strategically delegated tasks to different AI tools based on their strengths:

- 💻 **Code Generation & Refactoring:** Writing boilerplate code, implementing standard functions, and optimizing existing logic (Cursor, Copilot).
- 🐛 **Debugging:** Analyzing stack traces, identifying logical errors, and applying fixes (Cursor, Copilot).
- 🧪 **Testing & Quality Assurance:** Generating unit tests, performance testing, and running accessibility audits via Lighthouse (Cursor Agent).
- ⚙️ **DevOps & Workflows:** Managing Git commands, generating commit messages, and assisting with deployment configurations (Cursor Agent).
- 🏗️ **Architecture & Logic:** Designing system architecture, structuring MongoDB schemas, and planning REST API endpoints (ChatGPT, DeepSeek, Claude).
- 🗣️ **Meta-Prompting:** Writing highly optimized prompts to feed to our IDE coding agents (ChatGPT, DeepSeek).
- 📑 **Documentation & Reporting:** Generating academic reports and creating visual presentations (Canva, Gamma AI).

## Critical Review & Responsible AI Usage
To ensure the quality and security of our platform, all AI-generated outputs were treated as drafts rather than final solutions. Our team applied a strict validation process:
- **Manual Code Review:** All AI-generated code was reviewed by team members to ensure it aligned with our NestJS/Next.js architecture rules.
- **Security & Environment:** We never pasted sensitive data (like real `.env` variables or private credentials) into LLM prompts.
- **Testing Verification:** AI-generated unit tests were verified manually to ensure they tested actual edge cases and didn't just aim for artificial coverage.

## Prompts Used (Examples)
Here are representative examples of the exact prompts we used to interact with the AI tools across different stages of the project:

### Architecture & Logic
> *"Act as a senior software architect. We are building a construction management platform using Next.js and NestJS. Can you suggest a scalable folder structure for the backend and outline the core entities we need in MongoDB?"*

> *"Analyze this authentication flow. What are the potential security flaws, and how can we improve the JWT implementation in NestJS?"*

### Meta-Prompting (Creating prompts for other Agents)
> *"I need to instruct my Cursor agent to deploy my Next.js app and run a Lighthouse accessibility audit. Write a clear, step-by-step prompt that I can paste into Cursor to make it execute this flawlessly."*

### Code Generation & UI
> *"Generate a React component for the project Kanban board using Tailwind CSS and Radix UI. Ensure the drag-and-drop logic is modular and the component is fully fully responsive."*

### Testing & Quality Assurance
> *"Write comprehensive unit tests for the `TaskService` in this file. Make sure to mock the Mongoose repository and cover edge cases like missing IDs or unauthorized access."*

> *"Act as an accessibility expert. Run a Lighthouse audit on this page component and suggest specific code fixes for any score below 90."*

### Debugging, DevOps & Git
> *"I am getting a CORS error when my frontend on port 3000 tries to reach the API on port 3200. Analyze my `main.ts` file and provide the exact NestJS configuration to fix this."*

> *"Analyze the current git diff. Generate a conventional commit message summarizing these refactoring changes, and suggest the terminal commands to push them."*

---

## Academic Context
- **Program:** PI Full Stack JavaScript Program
- **Institution:** Esprit School of Engineering, Tunisia
- **Group:** 4TWIN1
- **Academic Year:** 2025-2026
