import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api/posts'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Post } from '@/types'

const TERMINAL_SCRIPT = [
  { type: 'cmd', text: 'curl -s api.outputlog.dev/v1/status | jq .version' },
  { type: 'out', text: '"v2.4.1-stable"' },
  { type: 'cmd', text: 'outputlog auth login --sso --org ai-devs' },
  { type: 'out', text: '✓ Authenticated as @devuser  [scope: read write admin]' },
  { type: 'cmd', text: 'outputlog posts list --category=discussion --sort=trending --limit=5' },
  { type: 'out', text: 'Fetching trending posts... 5 results (234ms)' },
  { type: 'cmd', text: 'outputlog ai summarize --model=gpt-4o --thread=latest' },
  { type: 'out', text: '⚡ Summary generated · tokens: 1,847 · cost: $0.003' },
]

const CATS = [
  { key:'DISCUSSION', icon:'💬', name:'Discussion', desc:'AI 토론' },
  { key:'QUESTION',   icon:'❓', name:'Question',   desc:'질문/답변' },
  { key:'SHOWCASE',   icon:'🚀', name:'Showcase',   desc:'프로젝트' },
  { key:'NEWS',       icon:'📡', name:'News',        desc:'AI 소식' },
  { key:'TUTORIAL',   icon:'📖', name:'Tutorial',   desc:'튜토리얼' },
]

const STATS = [
  { n: 1280, l: 'Posts' },
  { n: 4200, l: 'Members' },
  { n: 8700, l: 'Answers' },
]

function Counter({ to }: { to: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let cur = 0
    const step = Math.ceil(to / 50)
    const id = setInterval(() => { cur = Math.min(cur + step, to); setV(cur); if (cur >= to) clearInterval(id) }, 25)
    return () => clearInterval(id)
  }, [to])
  return <>{v.toLocaleString()}</>
}

function PostRow({ post }: { post: Post }) {
  return (
    <Link to={`/posts/${post.id}`} className="home-post-row">
      <span className="home-post-title">{post.title}</span>
      <span className="home-post-meta">
        <span className="home-post-author">@{post.author.nickname}</span>
        <span className="home-post-stat">♥ {post.likeCount}</span>
        <span className="home-post-stat">💬 {post.commentCount}</span>
        <span className="home-post-time">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
        </span>
      </span>
    </Link>
  )
}

function BoardSection({
  title, icon, category, color, viewAll,
}: {
  title: string; icon: string; category: string; color: string; viewAll: string
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['home-posts', category],
    queryFn: () => postsApi.getList({ category, size: 6, page: 0 }),
  })

  return (
    <div className="home-board">
      <div className="home-board-head">
        <span className="home-board-icon" style={{ color }}>{icon}</span>
        <span className="home-board-title" style={{ color }}>{title}</span>
        <Link to={viewAll} className="home-board-more">전체보기 →</Link>
      </div>
      <div className="home-board-list">
        {isLoading ? (
          <div className="home-board-loading">
            <div className="loading-ring" />
          </div>
        ) : !data?.content?.length ? (
          <div className="home-board-empty">// 아직 게시글이 없습니다</div>
        ) : (
          data.content.map(p => <PostRow key={p.id} post={p} />)
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= TERMINAL_SCRIPT.length) return
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 600 : 750)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-label">
          <span className="hero-label-dot" />
          AI Developer Community
        </div>
        <h1 className="hero-h1">
          Build. Learn.<br />
          <em>Share on OutputLog.</em>
        </h1>
        <p className="hero-sub">
          개발자들이 AI 기술을 토론하고, 질문하고, 프로젝트를 공유하는 공간입니다.
        </p>
        <div className="hero-cta">
          <Link to="/posts"  className="btn btn-primary">→ 게시글 보기</Link>
          <Link to="/signup" className="btn btn-secondary">커뮤니티 가입</Link>
        </div>

        <div className="terminal">
          <div className="terminal-bar">
            <span className="t-dot r" /><span className="t-dot y" /><span className="t-dot g" />
            <span className="terminal-title">bash — outputlog-cli v2.4.1</span>
          </div>
          <div className="terminal-body">
            {TERMINAL_SCRIPT.slice(0, shown).map((line, i) => (
              <div key={i} className="t-line">
                {line.type === 'cmd'
                  ? <><span className="t-ps">~$</span><span className="t-cmd"> {line.text}</span></>
                  : <span className="t-out">{line.text}</span>}
              </div>
            ))}
            {shown < TERMINAL_SCRIPT.length && (
              <div className="t-line">
                <span className="t-ps">~$</span><span className="t-caret" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Board Sections ── */}
      <div className="home-boards">
        <BoardSection
          title="AI 소식"
          icon="📡"
          category="NEWS"
          color="var(--green)"
          viewAll="/posts?category=NEWS"
        />
        <BoardSection
          title="AI 토론"
          icon="💬"
          category="DISCUSSION"
          color="var(--primary)"
          viewAll="/posts?category=DISCUSSION"
        />
      </div>
    </div>
  )
}
