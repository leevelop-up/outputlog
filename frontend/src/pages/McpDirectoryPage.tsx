import { useState } from 'react'
import SEO from '@/components/SEO'

interface McpServer {
  name: string
  desc: string
  category: string
  tags: string[]
  github?: string
  npm?: string
  stars?: number
}

const SERVERS: McpServer[] = [
  // 파일/시스템
  { name: 'filesystem', desc: '로컬 파일 시스템 읽기/쓰기/탐색', category: '파일·시스템', tags: ['공식','파일'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem', stars: 28000 },
  { name: 'everything', desc: '파일 빠른 검색 (Windows Everything 연동)', category: '파일·시스템', tags: ['검색','Windows'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/everything' },

  // 데이터베이스
  { name: 'postgres', desc: 'PostgreSQL 데이터베이스 쿼리·스키마 탐색', category: '데이터베이스', tags: ['공식','SQL'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres', stars: 28000 },
  { name: 'sqlite', desc: 'SQLite DB 쿼리 및 인사이트 분석', category: '데이터베이스', tags: ['공식','SQL'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite' },
  { name: 'mysql', desc: 'MySQL / MariaDB 연동 MCP 서버', category: '데이터베이스', tags: ['SQL','MySQL'], github: 'https://github.com/designcomputer/mysql_mcp_server' },
  { name: 'mongodb', desc: 'MongoDB 컬렉션 조회 및 쿼리', category: '데이터베이스', tags: ['NoSQL'], github: 'https://github.com/kiliczsh/mcp-mongo-server' },

  // 웹·검색
  { name: 'brave-search', desc: 'Brave Search API로 웹 검색', category: '웹·검색', tags: ['공식','검색'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search' },
  { name: 'fetch', desc: '웹 URL 콘텐츠 가져오기 (HTML→마크다운)', category: '웹·검색', tags: ['공식','크롤링'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch' },
  { name: 'puppeteer', desc: '헤드리스 브라우저 제어 (스크린샷·클릭)', category: '웹·검색', tags: ['공식','자동화'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer' },
  { name: 'playwright', desc: 'Playwright 브라우저 자동화', category: '웹·검색', tags: ['자동화','테스트'], github: 'https://github.com/executeautomation/mcp-playwright' },

  // 개발도구
  { name: 'github', desc: 'GitHub 이슈·PR·레포 관리', category: '개발도구', tags: ['공식','GitHub'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github', stars: 28000 },
  { name: 'gitlab', desc: 'GitLab 프로젝트·이슈·MR 관리', category: '개발도구', tags: ['GitLab'], github: 'https://github.com/zereight/gitlab-mcp' },
  { name: 'git', desc: 'Git 저장소 히스토리·diff·커밋 분석', category: '개발도구', tags: ['공식','Git'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/git' },
  { name: 'vscode', desc: 'VS Code 확장 기능 MCP 서버', category: '개발도구', tags: ['IDE'], github: 'https://github.com/BismuthCloud/vscode-mcp-server' },

  // AI·LLM
  { name: 'openai', desc: 'OpenAI API 직접 호출 (GPT, DALL-E 등)', category: 'AI·LLM', tags: ['OpenAI','이미지'], github: 'https://github.com/pierrebrunelle/mcp-server-openai' },
  { name: 'huggingface', desc: 'Hugging Face 모델·데이터셋 검색', category: 'AI·LLM', tags: ['HuggingFace'], github: 'https://github.com/evalstate/mcp-hfspace' },
  { name: 'langchain', desc: 'LangChain 도구·에이전트 MCP 래퍼', category: 'AI·LLM', tags: ['LangChain'], github: 'https://github.com/langchain-ai/langchain-mcp-adapters' },
  { name: 'context7', desc: '라이브러리 공식 문서를 LLM에 주입', category: 'AI·LLM', tags: ['문서'], npm: 'https://www.npmjs.com/package/@upstash/context7-mcp', stars: 5200 },

  // 클라우드·인프라
  { name: 'aws-kb-retrieval', desc: 'AWS Bedrock Knowledge Base 검색', category: '클라우드·인프라', tags: ['공식','AWS'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/aws-kb-retrieval-server' },
  { name: 'kubernetes', desc: 'Kubernetes 클러스터 관리', category: '클라우드·인프라', tags: ['K8s'], github: 'https://github.com/Flux159/mcp-server-kubernetes' },
  { name: 'docker', desc: 'Docker 컨테이너·이미지 관리', category: '클라우드·인프라', tags: ['Docker'], github: 'https://github.com/ckreiling/mcp-server-docker' },
  { name: 'cloudflare', desc: 'Cloudflare Workers·KV·R2·D1 관리', category: '클라우드·인프라', tags: ['Cloudflare'], github: 'https://github.com/cloudflare/mcp-server-cloudflare' },

  // 생산성
  { name: 'google-drive', desc: 'Google Drive 파일 검색·읽기', category: '생산성', tags: ['공식','Google'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive' },
  { name: 'slack', desc: 'Slack 메시지 전송·채널 조회', category: '생산성', tags: ['공식','Slack'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack' },
  { name: 'notion', desc: 'Notion 페이지·데이터베이스 읽기·쓰기', category: '생산성', tags: ['Notion'], github: 'https://github.com/v-3/notion-server' },
  { name: 'linear', desc: 'Linear 이슈·프로젝트 관리', category: '생산성', tags: ['PM'], github: 'https://github.com/linear/linear-mcp' },
  { name: 'google-calendar', desc: 'Google Calendar 일정 조회·생성', category: '생산성', tags: ['Google','일정'], github: 'https://github.com/nspilman/google-calendar-mcp' },

  // 메모리·지식
  { name: 'memory', desc: '지식 그래프 기반 영구 메모리', category: '메모리·지식', tags: ['공식','메모리'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory', stars: 28000 },
  { name: 'sequential-thinking', desc: '단계적 사고를 위한 동적 도구', category: '메모리·지식', tags: ['공식','추론'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking' },

  // 모니터링·분석
  { name: 'sentry', desc: 'Sentry 에러 조회·분석', category: '모니터링·분석', tags: ['Sentry','에러'], github: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sentry' },
  { name: 'grafana', desc: 'Grafana 대시보드·알림 조회', category: '모니터링·분석', tags: ['Grafana'], github: 'https://github.com/grafana/mcp-grafana' },
]

const CATEGORIES = ['전체', ...Array.from(new Set(SERVERS.map(s => s.category)))]

export default function McpDirectoryPage() {
  const [cat, setCat] = useState('전체')
  const [q, setQ] = useState('')

  const filtered = SERVERS.filter(s => {
    const matchCat = cat === '전체' || s.category === cat
    const matchQ = !q || s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.desc.includes(q) || s.tags.some(t => t.includes(q))
    return matchCat && matchQ
  })

  return (
    <div className="mcp-page">
      <SEO
        title="MCP 서버 디렉토리 | OutputLog"
        description="Model Context Protocol(MCP) 서버 목록. 파일, DB, GitHub, Slack, AI 등 카테고리별 MCP 서버를 찾아보세요."
        keywords="MCP 서버, Model Context Protocol, MCP 목록, Claude MCP, AI 도구"
      />

      <div className="mcp-hero">
        <h1 className="mcp-h1">MCP 서버 디렉토리</h1>
        <p className="mcp-sub">Model Context Protocol 서버 모음 — Claude, Cursor 등 AI 에이전트에 연결하세요</p>
        <input
          className="mcp-search"
          placeholder="🔍 서버 이름, 설명, 태그 검색..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <div className="mcp-cats">
        {CATEGORIES.map(c => (
          <button key={c} className={`mcp-cat-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="mcp-count">{filtered.length}개의 MCP 서버</div>

      <div className="mcp-grid">
        {filtered.map(s => (
          <div key={s.name} className="mcp-card">
            <div className="mcp-card-head">
              <span className="mcp-card-name">{s.name}</span>
              <span className="mcp-card-cat">{s.category}</span>
            </div>
            <p className="mcp-card-desc">{s.desc}</p>
            <div className="mcp-card-tags">
              {s.tags.map(t => <span key={t} className={`mcp-tag ${t === '공식' ? 'official' : ''}`}>{t}</span>)}
            </div>
            <div className="mcp-card-links">
              {s.github && (
                <a href={s.github} target="_blank" rel="noopener noreferrer" className="mcp-link github">
                  GitHub {s.stars ? `★ ${(s.stars/1000).toFixed(0)}k` : ''}
                </a>
              )}
              {s.npm && (
                <a href={s.npm} target="_blank" rel="noopener noreferrer" className="mcp-link npm">npm</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
