import os
from dotenv import load_dotenv

load_dotenv()

# Ollama 설정 (로컬, 무료)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "gemma3:4b")

# OutputLog API
OUTPUTLOG_API_URL  = os.getenv("OUTPUTLOG_API_URL", "http://localhost:8080")
OUTPUTLOG_EMAIL    = os.getenv("OUTPUTLOG_EMAIL", "admin@outputlog.dev")
OUTPUTLOG_PASSWORD = os.getenv("OUTPUTLOG_PASSWORD", "admin1234!")

# 역할별 모델 (기본은 같은 Ollama 모델, 나중에 다르게 설정 가능)
MODELS = {
    "orchestrator": OLLAMA_MODEL,
    "researcher":   OLLAMA_MODEL,
    "writer":       OLLAMA_MODEL,
    "editor":       OLLAMA_MODEL,
    "coder":        OLLAMA_MODEL,
    "publisher":    OLLAMA_MODEL,
}

MAX_TOKENS   = 4096
MEMORY_FILE  = "memory/team_memory.json"
