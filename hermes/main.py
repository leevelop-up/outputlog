"""
Hermes — 나만의 Claude 팀
사용법:
  python main.py                    # 대화형 팀 채팅
  python main.py news "GPT-5 출시"  # 뉴스 자동 작성
  python main.py news "GPT-5 출시" --publish  # 작성 후 OutputLog 게시
  python main.py code "FastAPI JWT 인증 구현"  # 코드 작성
  python main.py research "RAG vs Fine-tuning"  # 리서치만
"""
import sys
import os

# 경로 설정
sys.path.insert(0, os.path.dirname(__file__))

import typer
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.prompt import Prompt
from orchestrator import Orchestrator

app = typer.Typer(help="Hermes — 나만의 Claude AI 팀")
console = Console()

BANNER = """[bold green]
 ██╗  ██╗███████╗██████╗ ███╗   ███╗███████╗███████╗
 ██║  ██║██╔════╝██╔══██╗████╗ ████║██╔════╝██╔════╝
 ███████║█████╗  ██████╔╝██╔████╔██║█████╗  ███████╗
 ██╔══██║██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══╝  ╚════██║
 ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║███████╗███████║
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝
[/bold green]
[dim]나만의 Claude AI 팀 — Researcher · Writer · Editor · Coder · Publisher[/dim]
"""


def print_result(title: str, content: str):
    console.print(Panel(Markdown(content), title=f"[bold]{title}[/bold]", border_style="green"))


@app.command()
def chat():
    """대화형 팀 채팅 모드"""
    console.print(BANNER)
    console.print("[bold]팀과 대화를 시작합니다. [dim]exit[/dim]으로 종료[/bold]\n")
    console.print("[dim]팁: '뉴스 써줘: GPT-5', '코드 짜줘: FastAPI 인증', '조사해줘: Claude 시장점유율'[/dim]\n")

    orc = Orchestrator()

    while True:
        try:
            user_input = Prompt.ask("[bold cyan]You[/bold cyan]")
        except (EOFError, KeyboardInterrupt):
            console.print("\n[dim]Hermes 팀 종료[/dim]")
            break

        if user_input.lower() in ("exit", "quit", "종료"):
            console.print("[dim]Hermes 팀 종료[/dim]")
            break
        if not user_input.strip():
            continue

        # 키워드 기반 라우팅
        lower = user_input.lower()
        if any(k in lower for k in ("뉴스", "기사", "써줘", "작성")):
            topic = user_input.split(":", 1)[-1].strip() if ":" in user_input else user_input
            result = orc.run_news_pipeline(topic)
            print_result(result["title"], result["content"])
        elif any(k in lower for k in ("코드", "구현", "짜줘", "만들어")):
            task = user_input.split(":", 1)[-1].strip() if ":" in user_input else user_input
            console.print("[bold]💻 Coder[/bold] 작업 중...")
            resp = orc.coder.chat(task)
            print_result("코드", resp)
        elif any(k in lower for k in ("조사", "리서치", "검색")):
            topic = user_input.split(":", 1)[-1].strip() if ":" in user_input else user_input
            console.print("[bold]🔍 Researcher[/bold] 조사 중...")
            resp = orc.researcher.research(topic)
            print_result("리서치 결과", resp)
        else:
            # 오케스트레이터에게 직접 질문
            resp = orc.ask(user_input)
            console.print(f"\n[bold green]🎯 Hermes[/bold green]: {resp}\n")


@app.command()
def news(
    topic: str = typer.Argument(..., help="뉴스 주제"),
    publish: bool = typer.Option(False, "--publish", "-p", help="OutputLog에 자동 게시"),
):
    """AI 뉴스 자동 리서치 → 작성 → (게시)"""
    console.print(BANNER)
    orc = Orchestrator()
    result = orc.run_news_pipeline(topic, publish=publish)
    print_result(result["title"], result["content"])
    if "post_url" in result:
        console.print(f"\n[green]📡 게시됨:[/green] {result['post_url']}")


@app.command()
def research(topic: str = typer.Argument(..., help="조사할 주제")):
    """웹 검색 기반 리서치"""
    console.print(BANNER)
    orc = Orchestrator()
    console.print(f"[bold]🔍 Researcher[/bold] — {topic} 조사 중...\n")
    result = orc.researcher.research(topic)
    print_result("리서치 결과", result)


@app.command()
def code(task: str = typer.Argument(..., help="코드 작성 요청")):
    """코드 작성"""
    console.print(BANNER)
    orc = Orchestrator()
    console.print(f"[bold]💻 Coder[/bold] — 작업 중...\n")
    result = orc.coder.write_code(task)
    print_result("코드", result)


@app.command()
def team():
    """팀 멤버 소개"""
    console.print(BANNER)
    console.print(Panel(
        "\n".join([
            "[bold]🎯 Orchestrator[/bold]  claude-opus-4-8  — 판단, 조율, 전략",
            "[bold]🔍 Researcher[/bold]    claude-sonnet-4-6 — 웹 검색, 정보 수집",
            "[bold]✍️  Writer[/bold]       claude-sonnet-4-6 — 콘텐츠 작성",
            "[bold]📝 Editor[/bold]        claude-sonnet-4-6 — 검토, 개선",
            "[bold]💻 Coder[/bold]         claude-sonnet-4-6 — 코드 작성·리뷰",
            "[bold]📡 Publisher[/bold]     claude-haiku-4-5  — 포맷, OutputLog 게시",
        ]),
        title="[bold cyan]Hermes 팀 구성[/bold cyan]",
        border_style="cyan",
    ))


if __name__ == "__main__":
    if len(sys.argv) == 1:
        # 인자 없이 실행 시 대화 모드
        sys.argv.append("chat")
    app()
