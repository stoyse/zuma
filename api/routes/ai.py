from fastapi import APIRouter
from ai_engine.ai_handler import get_available_models

router = APIRouter()

@router.get("/models")
def list_models():
    api_url = "http://192.168.178.145:11434"  # Optional: make configurable later
    models = get_available_models(api_url)
    return {"models": models}
