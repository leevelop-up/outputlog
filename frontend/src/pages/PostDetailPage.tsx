import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postsApi } from '@/api/posts'
import { commentsApi } from '@/api/comments'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user, isAuthenticated } = useAuthStore()
  const [comment, setComment] = useState('')

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getById(postId),
  })
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsApi.getByPostId(postId),
  })

  const likeMut = useMutation({
    mutationFn: () => postsApi.toggleLike(postId),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['post', postId] })
      const prev = qc.getQueryData(['post', postId])
      qc.setQueryData(['post', postId], (old: any) => old ? {
        ...old,
        likedByMe: !old.likedByMe,
        likeCount: old.likedByMe ? old.likeCount - 1 : old.likeCount + 1,
      } : old)
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['post', postId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['post', postId] }),
  })
  const delMut = useMutation({
    mutationFn: () => postsApi.delete(postId),
    onSuccess: () => navigate('/posts'),
  })
  const commentMut = useMutation({
    mutationFn: () => commentsApi.create(postId, { content: comment }),
    onSuccess: () => { setComment(''); qc.invalidateQueries({ queryKey: ['comments', postId] }) },
  })

  if (isLoading) return <div className="loading"><div className="loading-ring" />loading...</div>
  if (!post)     return <div className="empty"><div className="empty-icon">🔍</div><div className="empty-msg">// post not found</div></div>

  const timeAgo = (d: string) => formatDistanceToNow(new Date(d), { addSuffix: true, locale: ko })

  return (
    <div className="post-detail">
      {/* ── Header ── */}
      <div className="post-hd">
        <div className="post-hd-top">
          <span className={`badge badge-${post.category}`}>{post.category.toLowerCase()}</span>
          {(post.tags ?? []).map(t => <span key={t} className="tag">#{t}</span>)}
        </div>
        <h1 className="post-hd-title">{post.title}</h1>
        <div className="post-hd-meta">
          <span className="post-hd-meta-item">@{post.author.nickname}</span>
          <span className="post-hd-meta-item">{timeAgo(post.createdAt)}</span>
          <span className="post-hd-meta-item">👁 {post.viewCount}</span>
          <span className="post-hd-meta-item">💬 {comments.length}</span>
          {user?.id === post.author.id && (
            <div className="post-hd-actions">
              <Link to={`/posts/${postId}/edit`} className="btn btn-secondary">수정</Link>
              <button onClick={() => delMut.mutate()} className="btn btn-danger">삭제</button>
            </div>
          )}
        </div>
      </div>

      {/* ── GitHub 링크 ── */}
      {post.sourceUrl && (
        <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="gh-source-link">
          <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          {post.sourceUrl.replace('https://github.com/', '')}
          <span className="gh-source-arrow">↗</span>
        </a>
      )}

      {/* ── Body ── */}
      <div className="post-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {(post.tags ?? []).length > 0 && (
        <div className="post-tags-wrap">
          {(post.tags ?? []).map(t => <span key={t} className="tag">#{t}</span>)}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="post-foot">
        <button
          className={`like-btn${post.likedByMe ? ' liked' : ''}`}
          onClick={() => isAuthenticated && likeMut.mutate()}
          disabled={!isAuthenticated}
        >
          ♥ {post.likeCount} {post.likedByMe ? 'liked' : 'like'}
        </button>
        <Link to="/posts" className="back-link">← back to posts</Link>
      </div>

      {/* ── Comments ── */}
      <section className="comments-section">
        <h2 className="comments-h">comments ({comments.length})</h2>

        {isAuthenticated && (
          <div className="comment-editor">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="// 댓글을 입력하세요..."
              rows={4}
            />
            <div className="comment-editor-foot">
              <button
                className="btn btn-primary"
                onClick={() => commentMut.mutate()}
                disabled={!comment.trim() || commentMut.isPending}
              >
                {commentMut.isPending ? '...' : '＋ add comment'}
              </button>
            </div>
          </div>
        )}

        <div className="comment-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-item-head">
                <span className="comment-nick">@{c.author.nickname}</span>
                <span className="comment-when">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="comment-text">{c.content}</p>
              {(c.replies ?? []).map(r => (
                <div key={r.id} className="reply-item">
                  <div className="comment-item-head">
                    <span className="comment-nick">@{r.author.nickname}</span>
                    <span className="comment-when">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="comment-text">{r.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
