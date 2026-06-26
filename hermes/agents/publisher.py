from agents.base import BaseAgent
from config import MODELS
from tools.outputlog import OutputLogClient


class Publisher(BaseAgent):
    name = "publisher"
    role = "📡 퍼블리셔"
    model = MODELS["publisher"]
    system_prompt = """당신은 콘텐츠 배포 담당자입니다.
역할: 완성된 글을 OutputLog에 적합한 형식으로 변환하고 게시합니다.

카테고리 분류 기준:
- NEWS: AI 최신 뉴스, 모델 출시, 기업 동향
- DISCUSSION: 기술 토론, 의견, 질문 유도
- TUTORIAL: 단계별 가이드, 실습 자료
- SHOWCASE: 프로젝트 공유, 데모
- QUESTION: 질문, 도움 요청

태그 생성 규칙:
- 3~5개, 영어/한국어 혼용 가능
- 핵심 기술명, 회사명, 주제어 위주
- 공백 없이 카멜케이스 또는 단어 단위"""

    def __init__(self, memory=None):
        super().__init__(memory)
        self.client = OutputLogClient()

    def prepare(self, title: str, content: str) -> dict:
        resp = self.chat(
            f"다음 글의 카테고리와 태그를 JSON으로만 출력해주세요.\n"
            f"형식: {{\"category\": \"NEWS\", \"tags\": [\"tag1\", \"tag2\"]}}\n\n"
            f"제목: {title}\n\n내용 일부:\n{content[:500]}"
        )
        import json, re
        match = re.search(r'\{.*\}', resp, re.DOTALL)
        if match:
            try:
                meta = json.loads(match.group())
                return {"category": meta.get("category", "NEWS"), "tags": meta.get("tags", [])}
            except json.JSONDecodeError:
                pass
        return {"category": "NEWS", "tags": []}

    def publish(self, title: str, content: str, category: str = "", tags: list[str] | None = None) -> dict | None:
        if not category or tags is None:
            meta = self.prepare(title, content)
            category = category or meta["category"]
            tags = tags if tags is not None else meta["tags"]

        return self.client.create_post(title=title, content=content, category=category, tags=tags)
