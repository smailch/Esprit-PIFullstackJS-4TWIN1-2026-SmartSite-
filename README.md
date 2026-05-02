<h1 align="center">PiSmartSite</h1>

<p align="center" style="margin: 15px;">
  <img src="https://readme-typing-svg.herokuapp.com?duration=2000&color=00BFFF&center=true&vCenter=true&width=500&lines=Full-stack+platform+for+construction+sites;Project+%26+task+management;Gantt+planning+%2B+Kanban;Documents+%26+progress+photos;Optional+AI+%28Groq%2C+Gemini%2C+OpenRouter%29" alt="Typing SVG" />
</p>

<h3 align="center">🏗️ Construction & maintenance · Projects, tasks, team, and budget</h3>
<h3 align="center">⚡ React Frontend (Next.js) · NestJS · MongoDB · PI Full Stack JS (ESPRIT)</h3>

<p align="center">
  📚 <strong>Academic project</strong> · Supervisor: <strong>Sassi Soumaya</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## Overview

PiSmartSite is a web application designed to manage construction projects end to end: project planning, tasks, resources, budget tracking, documents, progress photos, and reporting.

The frontend uses React with Next.js (App Router), the API is built with NestJS, and data is stored in MongoDB. An optional Python microservice (`FastAPI + YOLO`) can be used for construction photo analysis.

## Features

- CRUD for **projects**, **tasks**, **resources**, **jobs** (progress and photos), **people**, equipment, and attendance
- **Gantt** planning and **Kanban** workflow
- **Document management** (with versions) and **progress photo workflows** (validation + optional AI estimation)
- **AI features**: project analysis (Groq backend), task suggestions (OpenRouter / Next routes), optional Gemini debugging
- Modular REST API

## Tech Stack

### Frontend

- Next.js (React, App Router)
- TypeScript
- Tailwind CSS
- Radix UI

### Backend

- NestJS
- Node.js
- MongoDB (Mongoose)

Additional optional service:
- Python
- FastAPI
- YOLO

## Architecture

| Layer | Technology |
|------|------------|
| **Frontend** | React + Next.js (App Router), Tailwind, Radix UI |
| **Backend** | NestJS, Mongoose |
| **AI Service** | `smartsite-ai-service` - FastAPI, YOLO |
| **Database** | MongoDB |

Repository structure:

```text
PiSmartSite/
├── smarsite-frontend/    # Next.js frontend
├── smartsite-backend/    # NestJS API
├── smartsite-ai-service/ # FastAPI + YOLO (optional construction AI service)
├── .gitignore
└── README.md
```

## Contributors

- Smail Chemlali - Team member
- Walid Gobji - Team member
- Ahmed Allaya - Team member
- Frigui Wassim - Team member
- Mourad Missaoui - Team member

## Academic Context

Developed at **Esprit School of Engineering - Tunisia**  
PI Full Stack JS - 4TWIN1 | Academic Year 2025-2026

This project is part of the academic curriculum of **Esprit School of Engineering**.

## Getting Started

Prerequisites:

- Node.js **18+**
- **npm** or pnpm
- **MongoDB** (local or Atlas)
- Python **3.x** (only for `smartsite-ai-service`)

### Frontend

```bash
cd smarsite-frontend
npm install
npm run dev
```

### Backend

```bash
cd smartsite-backend
npm install
npm run start:dev
```

- Application: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3200](http://localhost:3200)

Environment files:

- Frontend: `smarsite-frontend/.env.local` (template: `.env.example`)
- Backend: `smartsite-backend/.env` (template: `.env.example`)

### Optional AI Service (`smartsite-ai-service`)

```bash
cd smartsite-ai-service
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
set YOLO_MODEL_PATH=weights\best.pt
uvicorn main:app --host 0.0.0.0 --port 8001
```

In `smartsite-backend/.env`, set:
`AI_ANALYSIS_URL=http://127.0.0.1:8001/analyze-image` (see `.env.example`).

Useful scripts:

| Folder | Commands |
|--------|----------|
| `smarsite-frontend` | `npm run dev` · `build` · `start` · `lint` |
| `smartsite-backend` | `npm run start:dev` · `build` · `start:prod` · `lint` · `test` · `migrate:tasks:dates` |

Best practices:

- Never commit secrets (`.env` / `.env.local` should remain local)
- Adjust CORS and MongoDB URI per environment

## Acknowledgments

Special thanks to our supervisor Sassi Soumaya for her guidance and support, and to the teaching team at **Esprit School of Engineering**.

## Dream House 3D (WIP)

- Added a dedicated concept track for an immersive **Dream House 3D** experience.
- Goal: allow stakeholders to preview project spaces with a simple interactive 3D navigation.
- Current scope for this iteration: documentation and quality benchmark preparation.

  ---

## AI Usage

This project integrated AI tools to assist with development, debugging, documentation, testing, and Git operations.

### ✅ AI Tools Used
- **GitHub Copilot** (Agent code)
- **Cursor AI** (Agent code)
- **ChatGPT** (OpenAI)
- **Claude** (Anthropic) — Agent code
- **DeepSeek** (architecture & logic analysis)
- **Canva AI** (report/presentation layout)

### ✅ How AI Was Used
- **Code generation:** components, DTOs, CRUD endpoints, UI helpers  
- **Debugging:** NestJS runtime errors, React rendering issues, API failures  
- **Documentation:** README sections, setup guides, architecture notes  
- **Testing:** test case ideas and edge‑case coverage  
- **Architecture & logic:** module boundaries, flows, and service interactions  
- **Git commands:** commit guidance and workflow suggestions  
- **Reporting:** Canva AI for academic report and slides design  

### ✅ Prompts (Examples)
- “Generate a NestJS module for project CRUD with Mongoose schema.”  
- “Create a Next.js page with a Kanban board using Tailwind.”  
- “Explain why this React hook causes re-render loops.”  
- “Draft a README section for environment setup.”  
- “Suggest edge cases for task scheduling with Gantt dependencies.”  
- “Summarize backend architecture for an academic report.”  

### ✅ LLMs & Agents
- **GitHub Copilot Agent** — code, debugging, documentation, testing, git commands  
- **Cursor AI Agent** — code, debugging, documentation, testing, git commands  
- **Claude Agent** — code, debugging, documentation, testing, git commands  
- **ChatGPT** — architecture & documentation  
- **DeepSeek** — architecture & system logic  

### ✅ Canva AI Report
Canva AI was used to generate the **layout and visuals** for the final academic report and presentation.

## Acknowledgment

<p align="center">
  <strong>🙏 Special thanks to our supervisor, Sassi Soumaya</strong><br/>
  for her guidance, support, and valuable feedback throughout this project.
</p>
<p align="center"> ⭐️ <em>PiSmartSite - PI Full Stack JS - ESPRIT</em> </p>
<p align="center"> <img src="https://camo.githubusercontent.com/64b973cb57806dd2b625e57e40571ce9ca4b4086d5c1ca932910cdaed296020a/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f7a356943766f316f4362717437756b4d51732f67697068792e676966" alt="" width="300"/> </p>
