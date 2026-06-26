import httpx
from config import OUTPUTLOG_API_URL, OUTPUTLOG_EMAIL, OUTPUTLOG_PASSWORD


class OutputLogClient:
    def __init__(self):
        self.base = OUTPUTLOG_API_URL
        self._token: str | None = None

    def _login(self) -> str:
        r = httpx.post(f"{self.base}/api/auth/login", json={
            "email": OUTPUTLOG_EMAIL,
            "password": OUTPUTLOG_PASSWORD,
        }, timeout=10)
        r.raise_for_status()
        self._token = r.json()["accessToken"]
        return self._token

    def _headers(self) -> dict:
        if not self._token:
            self._login()
        return {"Authorization": f"Bearer {self._token}", "Content-Type": "application/json"}

    def create_post(self, title: str, content: str, category: str = "NEWS", tags: list[str] | None = None) -> dict:
        data = {"title": title, "content": content, "category": category, "tags": tags or []}
        r = httpx.post(f"{self.base}/api/posts", json=data, headers=self._headers(), timeout=15)
        if r.status_code == 401:
            self._token = None
            r = httpx.post(f"{self.base}/api/posts", json=data, headers=self._headers(), timeout=15)
        r.raise_for_status()
        return r.json()

    def get_posts(self, category: str = "", size: int = 10) -> list[dict]:
        params = {"size": size}
        if category:
            params["category"] = category
        r = httpx.get(f"{self.base}/api/posts", params=params, timeout=10)
        r.raise_for_status()
        return r.json().get("content", [])
