import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { postsApi } from '@/api/posts'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuthStore } from '@/store/authStore'
import type { PostCategory } from '@/types'
import { useRef } from 'react'

const TABS: { key: PostCategory | ''; label: string }[] = [
  { key:'',           label:'all' },
  { key:'DISCUSSION', label:'discussion' },
  { key:'QUESTION',   label:'question' },
  { key:'SHOWCASE',   label:'showcase' },
  { key:'NEWS',       label:'news' },
  { key:'TUTORIAL',   label:'tutorial' },
]

export default function PostListPage() {
  const [params, setParams] = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const searchRef = useRef<HTMLInputElement>(null)

  const category = params.get('category') || ''
  const keyword  = params.get('keyword')  || ''
  const page     = Number(params.get('page') || 0)

  const { data, isLoading } = useQuery({
    queryKey: ['posts', category, keyword, page],
    queryFn: () => postsApi.getList({ category: category || undefined, keyword: keyword || undefined, page }),
  })

  const go = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([k, v]) => v ? next.set(k, v) : next.delete(k))
    next.delete('page')
    setParams(next)
  }

  return (
    <div className="post-list-page">
      <div className="page-header">
        <h1 className="page-title">posts</h1>
        {isAuthenticated && <Link to="/posts/new" className="btn btn-primary">＋ new post</Link>}
      </div>

      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          ref={searchRef}
          className="search-field"
          placeholder="Search posts..."
          defaultValue={keyword}
          onKeyDown={e => e.key === 'Enter' && go({ keyword: searchRef.current?.value ?? '' })}
        />
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.key} className={`tab${category === t.key ? ' active' : ''}`} onClick={() => go({ category: t.key })}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading"><div className="loading-ring" />loading...</div>
      ) : !data?.content.length ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <div className="empty-msg">// no posts found</div>
        </div>
      ) : (
        <>
          <div className="post-list">
            {data.content.map(post => (
              <Link key={post.id} to={`/posts/${post.id}`} className="post-card">
                <div className="post-card-top">
                  <span className={`badge badge-${post.category}`}>{post.category.toLowerCase()}</span>
                  {post.tags.slice(0,3).map(t => <span key={t} className="tag">#{t}</span>)}
                  <span className="post-card-author">@{post.author.nickname}</span>
                </div>
                <div className="post-card-title">{post.title}</div>
                <div className="post-card-meta">
                  <span>👁 {post.viewCount}</span>
                  <span>♥ {post.likeCount}</span>
                  <span>💬 {post.commentCount}</span>
                  <span className="post-card-time">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix:true, locale:ko })}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} className={`pg-btn${page===i?' active':''}`}
                  onClick={() => setParams({ ...(category&&{category}), page: String(i) })}>
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
