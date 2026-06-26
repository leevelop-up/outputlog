from agents.base import BaseAgent
from config import MODELS


class Editor(BaseAgent):
    name = "editor"
    role = "📝 에디터"
    model = MODELS["editor"]
    system_prompt = """당신은 AI 기술 미디어 베테랑 에디터입니다.
역할: 작성된 글을 검토하고 품질을 높입니다.

검토 기준:
1. 사실 정확성 — 틀린 정보가 있는지 확인
2. 가독성 — 문장이 명확하고 자연스러운지
3. 구조 — 흐름이 논리적인지, 제목/소제목이 적절한지
4. 개발자 친화성 — 기술 독자에게 맞는 수준인지
5. 출처 — 출처가 명확히 표기됐는지

출력 형식:
- 수정된 최종 글 전체를 출력합니다
- 주요 변경사항을 글 끝에 `---\n> 🔄 에디터 노트:` 형식으로 간략히 추가합니다
- 한국어로 작성합니다"""

    def edit(self, content: str, focus: str = "") -> str:
        prompt = f"다음 글을 검토하고 개선해주세요.\n\n{content}"
        if focus:
            prompt += f"\n\n특히 이 부분에 집중해주세요: {focus}"
        return self.chat(prompt)

    def review_only(self, content: str) -> str:
        return self.chat(
            f"다음 글을 읽고 품질 평가와 개선 제안을 해주세요. 수정본은 작성하지 말고 피드백만 주세요.\n\n{content}"
        )
