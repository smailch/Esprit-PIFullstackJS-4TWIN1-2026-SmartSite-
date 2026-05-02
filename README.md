<h1 align="center">SmartSite</h1>

<p align="center" style="margin: 15px;">
  <img src="https://readme-typing-svg.herokuapp.com?duration=2000&color=0EA5E9&center=true&vCenter=true&width=600&lines=Construction+project+management;Project+planning+%26+task+tracking;Documents+%26+progress+photos;Optional+AI+assistance" alt="Typing SVG" />
</p>

<p align="center">Construction platform for project planning, task tracking, documents, photos, and budget control.</p>

<p align="center">🏗️ Projects · 🔧 Tasks · 📊 Planning · 📁 Documents · 📸 Photos · 🤖 AI · 📡 API</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-111827?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## Overview

SmartSite is a web platform for managing construction projects end to end.
It covers planning, tasks, resources, budget tracking, documents, progress photos, reporting, and optional AI assistance.

## Features

- 🔧 Project, task, resource, and team management
- 📊 Gantt planning and Kanban workflow
- 📁 Document versioning and file tracking
- 📸 Progress photo workflows and validation
- 🤖 Optional AI analysis and task suggestions
- 📡 Modular REST API

## Tech Stack

### Frontend

- Next.js + React
- TypeScript
- Tailwind CSS
- Radix UI

### Backend

- NestJS
- Node.js
- MongoDB (Mongoose)
- FastAPI + YOLO for the optional AI service

## Architecture

| Layer | Stack |
| --- | --- |
| Frontend | Next.js + React |
| Backend | NestJS |
| Database | MongoDB |
| AI Service | FastAPI + YOLO |

Repository structure:

```text
PiSmartSite/
├── smartsite-frontend/    # Next.js frontend
├── smartsite-backend/     # NestJS API
├── smartsite-ai-service/  # Optional AI service
├── docs/
├── k8s/
└── README.md
```

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:3200
- Optional AI service: http://127.0.0.1:8001/analyze-image

## Environment Variables

- Frontend: `smartsite-frontend/.env.local`
- Backend: `smartsite-backend/.env`
- AI service: `YOLO_MODEL_PATH`
- Backend to AI bridge: `AI_ANALYSIS_URL`

## Getting Started

Frontend and backend are split into separate folders, so you can run each service independently.

### Frontend

```bash
cd smartsite-frontend
npm install
npm run dev
```

### Backend

```bash
cd smartsite-backend
npm install
npm run start:dev
```

### Optional AI Service

```bash
cd smartsite-ai-service
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
set YOLO_MODEL_PATH=weights\best.pt
uvicorn main:app --host 0.0.0.0 --port 8001
```

In `smartsite-backend/.env`, set:

```env
AI_ANALYSIS_URL=http://127.0.0.1:8001/analyze-image
```

Useful scripts:

| Folder | Commands |
| --- | --- |
| smartsite-frontend | npm run dev, build, start, lint |
| smartsite-backend | npm run start:dev, build, start:prod, lint, test, migrate:tasks:dates |

Best practices:

- Keep `.env` and `.env.local` out of git
- Adjust CORS and MongoDB URI per environment

## Contributors

- Smail Chemlali - Team member
- Walid Gobji - Team member
- Ahmed Allaya - Team member
- Frigui Wassim - Team member
- Mourad Missaoui - Team member

## Academic Context

- Program: PI Full Stack JavaScript Program
- Institution: Esprit School of Engineering, Tunisia
- Group: 4TWIN1
- Academic Year: 2025-2026

## AI Usage & Contribution

All AI interactions were performed using Large Language Models (LLMs) and AI coding agents.

Tools used:

- GitHub Copilot
- Large Language Models (LLMs)

AI-assisted tasks:

- Documentation restructuring and cleanup
- README formatting and section renaming
- Visual badge and header tuning for GitHub rendering
- Consistency review of paths, commands, and wording

LLMs and agents:

- LLM: GPT-5.4 mini
- Agent: GitHub Copilot AI coding agent

### Prompts Used (Examples)

- "Rewrite the README for a cleaner academic presentation."
- "Simplify the architecture section and remove redundant wording."
- "Update the GitHub badge layout for a more centered visual balance."

## Acknowledgments

Special thanks to our supervisor Sassi Soumaya for her guidance and support, and to the teaching team at Esprit School of Engineering.

## Dream House 3D (WIP)

- Dedicated concept track for immersive Dream House 3D exploration.
- Goal: a simple interactive navigation experience for stakeholder previews.
- Current scope: documentation and quality benchmark preparation.

<p align="center">⭐ <em>SmartSite - PI Full Stack JavaScript Program - ESPRIT</em></p>
