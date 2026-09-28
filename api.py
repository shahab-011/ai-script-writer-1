import logging
import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from sequential_workflow import app as workflow

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

api = FastAPI(title="Scriptflow API", version="1.0.0")
cors_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
api.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ScriptRequest(BaseModel):
    raw_input: str = Field(min_length=8, max_length=8000)


@api.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@api.post("/api/generate")
def generate(request: ScriptRequest) -> dict[str, Any]:
    raw_input = request.raw_input.strip()
    if len(raw_input) < 8:
        raise HTTPException(status_code=422, detail="Please provide at least 8 non-space characters.")
    try:
        result = workflow.invoke({"raw_input": raw_input})
    except Exception as exc:
        logger.exception("Script generation failed")
        raise HTTPException(status_code=502, detail="Script generation failed. Please try again shortly.") from exc
    return {
        "raw_input": result["raw_input"],
        "edited_text": result["edited_text"],
        "script_text": result["script_text"],
        "final_output": result["final_output"],
    }
