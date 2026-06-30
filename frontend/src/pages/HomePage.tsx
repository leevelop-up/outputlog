import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api/posts'
import { formatDistanceToNow } from 'date-fns'
import SEO from '@/components/SEO'
import { ko } from 'date-fns/locale'
import type { Post } from '@/types'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d',
  C: '#555555', Ruby: '#701516', Swift: '#F05138', Kotlin: '#A97BFF',
  Shell: '#89e051', PHP: '#4F5D95', 'C#': '#178600', Dart: '#00B4AB',
}

function GhCard({ post }: { post: Post }) {
  const repoName = post.sourceUrl
    ? post.sourceUrl.replace('https://github.com/', '')
    : post.title.replace('[GitHub] ', '').split(' — ')[0]

  const desc = post.title.includes(' — ')
    ? post.title.split(' — ').slice(1).join(' — ')
    : post.title

  const lang = post.tags?.find(t => LANG_COLORS[t]) || ''
  const color = LANG_COLORS[lang] || '#8b949e'

  return (
    <Link to={`/posts/${post.id}`} className="gh-card">
      <div className="gh-card-name">{repoName}</div>
      <div className="gh-card-desc">{desc}</div>
      <div className="gh-card-foot">
        {lang && <><span className="gh-lang-dot" style={{ background: color }} /><span className="gh-lang">{lang}</span></>}
        <span className="gh-stat">♥ {post.likeCount}</span>
        <span className="gh-stat">💬 {post.commentCount}</span>
      </div>
    </Link>
  )
}

const CATS = [
  { key:'QUESTION', name:'질문',     desc:'궁금한 것을 물어보세요', path:'/question' },
  { key:'NEWS',     name:'최신뉴스', desc:'AI · 개발 최신 소식',   path:'/news' },
  { key:'SHOWCASE', name:'프로젝트', desc:'만든 것을 공유하세요',   path:'/projects' },
  { key:'GITHUB',   name:'GitHub',  desc:'오픈소스 & 트렌딩',      path:'/github' },
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
  const { data: ghPosts } = useQuery({
    queryKey: ['home-posts', 'GITHUB'],
    queryFn: () => postsApi.getList({ category: 'GITHUB', size: 8, page: 0 }),
  })

  return (
    <div className="home">
      <SEO
        title="개발자 커뮤니티"
        description="AI·웹개발·백엔드·프론트엔드·DevOps 등 모든 개발 관련 질문·토론·뉴스를 공유하는 개발자 커뮤니티입니다."
        keywords="개발자 커뮤니티, 한국 개발자 커뮤니티, 프로그래밍 질문, AI 개발, 웹개발, 백엔드, 프론트엔드, 오픈소스"
      />
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-label">
          <span className="hero-label-dot" />
          개발자 커뮤니티
        </div>
        <h1 className="hero-h1">
          Build. Learn.<br />
          <em>Share on OutputLog.</em>
        </h1>
        <p className="hero-sub">
          개발자들이 기술을 토론하고, 질문하고, 프로젝트를 공유하는 공간입니다.
        </p>
        <div className="hero-cta">
          <Link to="/posts"  className="btn btn-primary">→ 게시글 보기</Link>
          <Link to="/signup" className="btn btn-secondary">커뮤니티 가입</Link>
        </div>

        <div className="gh-trending-wrap">
          <div className="gh-trending-header">
            <span className="gh-trending-icon">
              <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub Trending
            </span>
            <span className="gh-trending-sub">// 지금 뜨는 오픈소스 저장소</span>
            <Link to="/github" className="gh-trending-more">게시판 보기 →</Link>
          </div>
          <div className="gh-grid">
            {ghPosts?.content?.length
              ? ghPosts.content.map(p => <GhCard key={p.id} post={p} />)
              : Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="gh-card gh-card-skeleton" />
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Board Sections ── */}
      <div className="home-boards">
        <BoardSection
          title="최신뉴스"
          icon=""
          category="NEWS"
          color="var(--green)"
          viewAll="/news"
        />
        <BoardSection
          title="프로젝트"
          icon=""
          category="SHOWCASE"
          color="var(--primary)"
          viewAll="/projects"
        />
      </div>
    </div>
  )
}
