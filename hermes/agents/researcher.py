from agents.base import BaseAgent
from config import MODELS
from tools.search import web_search


class Researcher(BaseAgent):
    name = "researcher"
    role = "🔍 리서처"
    model = MODELS["researcher"]
    system_prompt = """당신은 AI 기술 전문 리서처입니다.
역할: 주어진 주제에 대해 최신 정보를 수집하고 핵심 사실을 정리합니다.

규칙:
- 항상 출처와 함께 정보를 제공합니다
- 불확실한 정보는 명확히 표시합니다
- 기술적 정확성을 최우선으로 합니다
- 결과는 구조화된 마크다운으로 출력합니다
- 한국어로 응답합니다"""

    def research(self, topic: str) -> str:
        # 웹 검색 결과를 컨텍스트로 포함
        search_results = web_search(topic)
        context = f"## 웹 검색 결과\n{search_results}"
        return self.chat(
            f"다음 주제에 대해 조사해주세요: {topic}\n\n"
            "핵심 사실, 최신 동향, 중요 통계, 출처를 포함해서 정리해주세요.",
            context=context,
        )
