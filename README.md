# Scriptflow — AI Script Studio

A React writing studio backed by a FastAPI service and a sequential LangGraph pipeline. A rough idea moves through three nodes: editor, scriptwriter, and Hinglish localizer.

## Deploy the backend to Render

1. Push this repository to GitHub and choose **New → Blueprint** in Render. Select this repository; Render reads `render.yaml` to create the API service.
2. Set the required `GROQ_API_KEY` in the Render environment settings. Keep it private; do not commit `.env`.
3. Set `CORS_ORIGINS` to the exact Netlify site origin, such as `https://your-project.netlify.app` (scheme included, no path). You can provide several comma-separated origins for production and preview domains.
4. Deploy. Confirm the API health endpoint returns `{"status":"ok"}` at `https://<your-render-service>.onrender.com/api/health`.

The Render service uses Python 3.12, installs only the dependencies needed by the API, binds to Render's `$PORT`, and exposes a health check. If you create the Netlify site after the API, update `CORS_ORIGINS` in Render and redeploy.

## Deploy the frontend to Netlify

1. Import this GitHub repository as a Netlify site. Keep the base directory at the repository root; `netlify.toml` sets the build command, `dist` publish directory, Node version, and SPA fallback.
2. Add the environment variable `VITE_API_URL` with the full Render API origin, for example `https://your-service.onrender.com` (no `/api` suffix).
3. Deploy or redeploy after saving the variable.

Vite embeds `VITE_API_URL` into the public frontend bundle. It must contain only the API's public URL, never a secret. Set your Netlify production domain as an allowed origin in Render's `CORS_ORIGINS`. For deploy previews, add the specific preview origin(s) to `CORS_ORIGINS` if you want them to call the API.

## Run locally

1. Create a Python virtual environment, install `requirements.txt`, and put your Groq key in a local `.env` file. `.env.example` shows the variable names.
2. Start the API:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   uvicorn api:api --reload
   ```

3. In another terminal, install and start the frontend:

   ```powershell
   npm ci
   npm run dev
   ```

4. Open `http://localhost:5173`. The local frontend uses `http://localhost:8000` by default. You can override this with `VITE_API_URL`.

## API

- `GET /api/health` — service health check
- `POST /api/generate` — accepts `{"raw_input":"..."}` and returns `raw_input`, `edited_text`, `script_text`, and `final_output`

The free Render plan may spin down while idle, so its first request after a quiet period can take longer. For a consistently responsive public app, use an always-on service plan.
