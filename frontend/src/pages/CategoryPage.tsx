import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { postsApi } from '@/api/posts'
import { useAuthStore } from '@/store/authStore'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRef } from 'react'
import type { PostCategory } from '@/types'
import { CATEGORY_LABELS, MAIN_CATEGORIES } from '@/constants/categories'

interface Props {
  category: PostCategory
}

export default function CategoryPage({ category }: Props) {
  const [params, setParams] = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const searchRef = useRef<HTMLInputElement>(null)

  const keyword = params.get('keyword') || ''
  const page    = Number(params.get('page') || 0)

  const meta = MAIN_CATEGORIES.find(c => c.key === category)!

  const { data, isLoading } = useQuery({
    queryKey: ['posts', category, keyword, page],
    queryFn: () => postsApi.getList({ category, keyword: keyword || undefined, page }),
  })

  const setSearch = (kw: string) => {
    const next = new URLSearchParams()
    if (kw) next.set('keyword', kw)
    setParams(next)
  }

  return (
    <div className="post-list-page">
      <div className="cat-page-header" style={{ borderColor: meta.color }}>
        <span className="cat-page-icon">{meta.icon}</span>
        <div>
          <h1 className="cat-page-title" style={{ color: meta.color }}>{meta.label}</h1>
          <p className="cat-page-desc">{meta.desc}</p>
        </div>
        {isAuthenticated && (
          <Link to={`/posts/new?category=${category}`} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            ＋ 글쓰기
          </Link>
        )}
      </div>

      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          ref={searchRef}
          className="search-field"
          placeholder="Search posts..."
          defaultValue={keyword}
          onKeyDown={e => e.key === 'Enter' && setSearch(searchRef.current?.value ?? '')}
        />
      </div>

      {isLoading ? (
        <div className="loading"><div className="loading-ring" />loading...</div>
      ) : !data?.content?.length ? (
        <div className="empty">
          <div className="empty-icon">{meta.icon}</div>
          <div className="empty-msg">// 아직 게시글이 없습니다</div>
          {isAuthenticated && (
            <Link to={`/posts/new?category=${category}`} className="btn btn-primary" style={{ marginTop: 16 }}>
              첫 번째 글 작성하기
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="post-list">
            {data.content.map(post => (
              <Link key={post.id} to={`/posts/${post.id}`} className="post-card">
                <div className="post-card-top">
                  <span className={`badge badge-${post.category}`}>{CATEGORY_LABELS[post.category]}</span>
                  {(post.tags ?? []).slice(0, 3).map(t => <span key={t} className="tag">#{t}</span>)}
                  <span className="post-card-author">@{post.author.nickname}</span>
                </div>
                <div className="post-card-title">{post.title}</div>
                <div className="post-card-meta">
                  <span>👁 {post.viewCount}</span>
                  <span>♥ {post.likeCount}</span>
                  <span>💬 {post.commentCount}</span>
                  <span className="post-card-time">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pg-btn${page === i ? ' active' : ''}`}
                  onClick={() => {
                    const next = new URLSearchParams(params)
                    next.set('page', String(i))
                    setParams(next)
                  }}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
