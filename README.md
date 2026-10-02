# BrandShield AI

This project is a React + Vite frontend for a LangGraph-powered script safety analyzer. It includes a modern dark interface, a sample-driven input workspace, and an About page that explains the workflow, the value of LangGraph, and what was learned while building the project.

## Stack

- Frontend: React + Vite + Lucide icons
- Backend API: FastAPI + LangGraph
- AI provider: Groq via LangChain Groq integration
- Deployment: Vercel (frontend) + Render (backend)

## Local development

```bash
npm install
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
npm run dev -- --host 0.0.0.0
```

Then open the Vite dev server in your browser.

## Backend service

Start the API locally:

```bash
.\.venv\Scripts\Activate.ps1
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The frontend is configured to call `/api/analyze` through Vite proxy. In production, set `VITE_API_URL` to your Render backend URL.

## Environment variables

Copy `.env.example` and fill in the values:

```bash
copy .env.example .env
```

Then add:

- `GROQ_API_KEY` for real LLM analysis
- `VITE_API_URL` for the deployed Render API URL
- `VITE_API_PROXY_TARGET` for local proxying during development

## Deployment plan

### Frontend on Vercel

1. Import this repository into Vercel.
2. Set the framework to Vite.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add environment variable:
   - `VITE_API_URL=https://your-render-service.onrender.com/api/analyze`

### Backend on Render

1. Create a Web Service on Render.
2. Connect this GitHub repo.
3. Use the `render.yaml` file in the root.
4. Add environment variable:
   - `GROQ_API_KEY=your_key_here`
5. Deploy.

## Production notes

- The frontend includes a graceful fallback mode if the API is unavailable, so the UI still works during demos or early rollout.
- The API returns a structured `safety_scores` payload that the frontend can render in the report panel.
- The project is ready for GitHub push and deployment as a two-service setup: frontend on Vercel and backend on Render.

## Git push

After authenticating with GitHub, run:

```bash
git init
git branch -M main
git remote add origin https://github.com/shahab-011/ai-script-writer-1.git
git add .
git commit -m "Deploy-ready BrandShield AI frontend and API"
git push -u origin main
```

> The project cannot complete the remote GitHub push from this session without your GitHub credentials or a configured token.
