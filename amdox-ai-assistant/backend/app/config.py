import os

# ==========================================
# Application Configuration Settings
# ==========================================

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")  # openai, gemini, ollama, azure
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

ERP_API_BASE_URL = os.getenv("ERP_API_BASE_URL", "http://localhost:3000/api")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "amdox-ai-assistant-secret-jwt-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
