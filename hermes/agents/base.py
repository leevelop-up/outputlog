import httpx
from config import OLLAMA_BASE_URL, MAX_TOKENS


def _ollama_chat(model: str, system: str, messages: list[dict], max_tokens: int = MAX_TOKENS) -> str:
    """Ollama /api/chat 호출 (OpenAI 호환 포맷)"""
    payload = {
        "model": model,
        "messages": [{"role": "system", "content": system}] + messages,
        "stream": False,
        "options": {"num_predict": max_tokens},
    }
    r = httpx.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload, timeout=300)
    r.raise_for_status()
    return r.json()["message"]["content"]


class BaseAgent:
    name: str = "agent"
    role: str = ""
    model: str = "gemma3:4b"
    system_prompt: str = ""

    def __init__(self, memory: list[dict] | None = None):
        self.memory: list[dict] = memory or []

    def chat(self, user_message: str, context: str = "") -> str:
        system = self.system_prompt
        if context:
            system += f"\n\n## 추가 컨텍스트\n{context}"

        messages = self.memory + [{"role": "user", "content": user_message}]
        result = _ollama_chat(self.model, system, messages)

        self.memory.append({"role": "user", "content": user_message})
        self.memory.append({"role": "assistant", "content": result})
        if len(self.memory) > 20:
            self.memory = self.memory[-20:]

        return result

    def reset(self):
        self.memory = []

    def __repr__(self):
        return f"<{self.__class__.__name__} model={self.model}>"
