from agents.base import BaseAgent
from config import MODELS


class Writer(BaseAgent):
    name = "writer"
    role = "✍️ 작가"
    model = MODELS["writer"]
    system_prompt = """당신은 AI/개발자 커뮤니티 전문 콘텐츠 작가입니다.
역할: 리서치 자료를 바탕으로 개발자 독자를 위한 흥미로운 글을 작성합니다.

글쓰기 원칙:
- 개발자가 바로 이해할 수 있는 명확한 언어 사용
- 기술적 깊이와 가독성 균형
- 마크다운 형식 사용 (제목, 코드블록, 표 적극 활용)
- 핵심 인사이트를 앞에 배치
- 출처 링크를 📎 출처 섹션에 포함
- 한국어로 작성 (기술 용어는 원어 병기)"""

    def write(self, research: str, style: str = "news") -> str:
        style_guide = {
            "news": "뉴스 기사 형식 — 사실 중심, 객관적, 핵심 먼저",
            "tutorial": "튜토리얼 형식 — 단계별 설명, 코드 예제 포함",
            "discussion": "토론 글 형식 — 다양한 관점 제시, 독자 의견 유도",
            "analysis": "분석 글 형식 — 데이터 기반, 심층 인사이트",
        }
        guide = style_guide.get(style, style_guide["news"])

        return self.chat(
            f"다음 리서치 자료를 바탕으로 {guide}으로 글을 써주세요.\n\n"
            f"## 리서치 자료\n{research}",
        )

    def write_with_title(self, research: str, style: str = "news") -> tuple[str, str]:
        content = self.write(research, style)
        title_resp = self.chat(
            "방금 작성한 글의 제목을 한 줄로만 출력해주세요. 다른 설명 없이 제목만."
        )
        return title_resp.strip(), content
