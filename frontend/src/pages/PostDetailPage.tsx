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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['post', postId] }),
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
