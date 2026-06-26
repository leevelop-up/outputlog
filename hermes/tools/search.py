from ddgs import DDGS


def web_search(query: str, max_results: int = 5) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        if not results:
            return "검색 결과 없음"
        lines = []
        for r in results:
            lines.append(f"**{r.get('title', '')}**")
            lines.append(r.get('body', ''))
            lines.append(f"출처: {r.get('href', '')}")
            lines.append("")
        return "\n".join(lines)
    except Exception as e:
        return f"검색 오류: {e}"


def news_search(query: str, max_results: int = 5) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.news(query, max_results=max_results))
        if not results:
            return "뉴스 검색 결과 없음"
        lines = []
        for r in results:
            lines.append(f"**{r.get('title', '')}** ({r.get('date', '')})")
            lines.append(r.get('body', ''))
            lines.append(f"출처: {r.get('url', '')}")
            lines.append("")
        return "\n".join(lines)
    except Exception as e:
        return f"뉴스 검색 오류: {e}"
