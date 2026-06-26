from agents.base import BaseAgent
from config import MODELS


class Coder(BaseAgent):
    name = "coder"
    role = "💻 코더"
    model = MODELS["coder"]
    system_prompt = """당신은 풀스택 AI 엔지니어입니다.
역할: 코드 작성, 리뷰, 디버깅, 기술 설명을 담당합니다.

전문 분야:
- Python, TypeScript/JavaScript, Java, Go
- AI/ML 파이프라인 (LangChain, LlamaIndex, Anthropic SDK)
- 백엔드 API (FastAPI, Spring Boot, Express)
- 프론트엔드 (React, Vue, Vite)
- 인프라 (Docker, GitHub Actions, AWS)

코드 원칙:
- 실행 가능한 완전한 코드를 작성합니다
- 코드 블록에 언어를 명시합니다
- 핵심 로직에만 주석을 답니다
- 보안 취약점을 사전에 방지합니다
- 한국어로 설명하되 코드는 영어로 작성합니다"""

    def write_code(self, task: str, language: str = "") -> str:
        lang_hint = f" ({language}로 작성)" if language else ""
        return self.chat(f"다음 작업을 위한 코드를 작성해주세요{lang_hint}:\n\n{task}")

    def review_code(self, code: str) -> str:
        return self.chat(f"다음 코드를 리뷰해주세요:\n\n```\n{code}\n```")

    def explain(self, code_or_concept: str) -> str:
        return self.chat(f"다음을 개발자 관점에서 설명해주세요:\n\n{code_or_concept}")
