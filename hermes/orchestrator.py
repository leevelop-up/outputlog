"""
오케스트레이터 — 작업을 분석하고 팀 에이전트를 조율합니다.
"""
import asyncio
from concurrent.futures import ThreadPoolExecutor
from agents import Researcher, Writer, Editor, Coder, Publisher
from agents.base import BaseAgent, client
from config import MODELS
from rich.console import Console

console = Console()


class Orchestrator(BaseAgent):
    name = "orchestrator"
    role = "🎯 오케스트레이터"
    model = MODELS["orchestrator"]
    system_prompt = """당신은 AI 에이전트 팀의 오케스트레이터입니다.
팀 구성:
- 🔍 Researcher: 웹 검색 및 정보 수집
- ✍️ Writer: 콘텐츠 작성
- 📝 Editor: 검토 및 개선
- 💻 Coder: 코드 작성 및 리뷰
- 📡 Publisher: OutputLog 게시

역할:
1. 사용자 요청을 분석해서 어떤 에이전트가 필요한지 판단합니다
2. 작업을 순서대로 또는 병렬로 분배합니다
3. 각 에이전트의 결과를 통합합니다
4. 최종 결과를 사용자에게 명확히 전달합니다

응답은 항상 한국어로 합니다."""

    def __init__(self):
        super().__init__()
        self.researcher = Researcher()
        self.writer = Writer()
        self.editor = Editor()
        self.coder = Coder()
        self.publisher = Publisher()

    @property
    def team(self) -> dict[str, BaseAgent]:
        return {
            "researcher": self.researcher,
            "writer": self.writer,
            "editor": self.editor,
            "coder": self.coder,
            "publisher": self.publisher,
        }

    def route(self, task: str) -> str:
        """어떤 에이전트(들)가 필요한지 판단"""
        resp = self.chat(
            f"다음 작업을 처리하려면 어떤 에이전트가 필요하고 어떤 순서로 실행해야 하나요?\n"
            f"에이전트 이름만 순서대로 콤마로 구분해서 출력하세요. "
            f"예: researcher,writer,editor,publisher\n\n작업: {task}"
        )
        return resp.strip().lower()

    # ── 파이프라인 ──────────────────────────────────────

    def run_news_pipeline(self, topic: str, publish: bool = False) -> dict:
        """리서치 → 작성 → 편집 → (게시) 파이프라인"""
        console.print(f"\n[bold cyan]🚀 뉴스 파이프라인 시작:[/] {topic}\n")

        console.print("[bold]🔍 Researcher[/] 조사 중...")
        research = self.researcher.research(topic)

        console.print("[bold]✍️  Writer[/] 작성 중...")
        title, content = self.writer.write_with_title(research, style="news")

        console.print("[bold]📝 Editor[/] 검토 중...")
        edited = self.editor.edit(content)

        result = {"title": title, "content": edited, "research": research}

        if publish:
            console.print("[bold]📡 Publisher[/] 게시 중...")
            post = self.publisher.publish(title, edited)
            if post:
                result["post_id"] = post.get("id")
                result["post_url"] = f"/posts/{post.get('id')}"
                console.print(f"[green]✅ 게시 완료:[/] post #{post.get('id')}")

        return result

    def run_parallel(self, tasks: list[tuple[str, str]]) -> list[str]:
        """여러 작업을 병렬로 실행. tasks = [(agent_name, task_str), ...]"""
        console.print(f"\n[bold cyan]⚡ 병렬 실행:[/] {len(tasks)}개 작업\n")

        def run_task(agent_name: str, task: str) -> str:
            agent = self.team.get(agent_name)
            if not agent:
                return f"에이전트 '{agent_name}' 없음"
            return agent.chat(task)

        with ThreadPoolExecutor(max_workers=len(tasks)) as executor:
            futures = [executor.submit(run_task, name, task) for name, task in tasks]
            return [f.result() for f in futures]

    def ask(self, question: str) -> str:
        """오케스트레이터에게 자유 질문"""
        return self.chat(question)
