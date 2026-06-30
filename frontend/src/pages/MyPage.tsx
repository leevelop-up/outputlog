import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import client from '@/api/client'
import type { Post } from '@/types'
import { CATEGORY_LABELS } from '@/constants/categories'

interface ProfileUpdateForm {
  nickname: string
  bio: string
  githubUrl: string
  websiteUrl: string
}

export default function MyPage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileUpdateForm>({ nickname: '', bio: '', githubUrl: '', websiteUrl: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setForm({
      nickname: user?.nickname ?? '',
      bio: user?.bio ?? '',
      githubUrl: user?.githubUrl ?? '',
      websiteUrl: user?.websiteUrl ?? '',
    })
    loadMyPosts()
  }, [isAuthenticated])

  const loadMyPosts = async () => {
    try {
      const res = await client.get('/posts', { params: { size: 100, page: 0 } })
      const content: Post[] = Array.isArray(res.data?.content) ? res.data.content : []
      const posts = content.filter(p => p.author?.nickname === user?.nickname)
      setMyPosts(posts)
    } catch {
      setMyPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.nickname.trim()) { setError('닉네임을 입력해주세요.'); return }
    setSaving(true); setError('')
    try {
      const res = await client.put('/users/me', form)
      setUser(res.data)
      setEditing(false)
    } catch (e: any) {
      setError(e.response?.data?.message ?? '저장 실패')
    } finally {
      setSaving(false) }
  }

  const handleLogout = async () => {
    try { await client.post('/auth/logout') } catch {}
    logout()
    navigate('/')
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  if (!isAuthenticated) return null

  return (
    <div className="page-container" style={{ maxWidth: 720, padding: '40px 20px' }}>
      {/* 프로필 카드 */}
      <div className="auth-box" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          {/* 아바타 */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--bg-hover)', border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0
          }}>
            {user?.profileImage
              ? <img src={user.profileImage} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : (user?.nickname?.[0] ?? '?').toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">닉네임</label>
                  <input
                    className="form-input"
                    value={form.nickname}
                    onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                    maxLength={30}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">한 줄 소개</label>
                  <input
                    className="form-input"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="간단한 자기소개"
                    maxLength={100}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub 주소</label>
                  <input
                    className="form-input"
                    value={form.githubUrl}
                    onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">홈페이지 주소</label>
                  <input
                    className="form-input"
                    value={form.websiteUrl}
                    onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                    placeholder="https://yoursite.com"
                  />
                </div>
                {error && <span className="form-error">{error}</span>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ fontSize: 13, padding: '6px 16px' }}>
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button className="btn" onClick={() => { setEditing(false); setError('') }} style={{ fontSize: 13, padding: '6px 16px' }}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: 20, color: 'var(--text)' }}>{user?.nickname}</h2>
                  {user?.provider && (
                    <span style={{ fontSize: 11, background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-muted)' }}>
                      {user.provider === 'github' ? '🐙 GitHub' : '🔵 Google'}
                    </span>
                  )}
                  <span style={{
                    fontSize: 12, fontFamily: 'var(--mono)',
                    background: 'var(--primary)', color: '#fff',
                    padding: '2px 10px', borderRadius: 12, fontWeight: 600,
                  }}>
                    {(user?.points ?? 0).toLocaleString()} pts
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  {user?.bio || '소개가 없습니다.'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                  {user?.email}
                </p>
                <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {user?.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg height="14" viewBox="0 0 16 16" width="14" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                      GitHub
                    </a>
                  )}
                  {user?.websiteUrl && (
                    <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      🌐 홈페이지
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {!editing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 'auto' }}>
              <button className="btn" onClick={() => setEditing(true)} style={{ fontSize: 13, padding: '6px 16px' }}>
                프로필 편집
              </button>
              <button onClick={handleLogout} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 6,
                color: 'var(--text-muted)', fontSize: 12, padding: '5px 14px', cursor: 'pointer',
              }}>
                로그아웃
              </button>
            </div>
          )}
        </div>

        {/* 포인트 현황 */}
        {!editing && (
          <div style={{
            marginTop: 20, padding: '14px 16px', borderRadius: 8,
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)' }}>POINTS</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
              {(user?.points ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              글 작성 +10점 · 글 삭제 -10점
            </div>
          </div>
        )}
      </div>

      {/* 내 게시글 */}
      <div>
        <h3 style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, letterSpacing: 1 }}>
          MY POSTS <span style={{ color: 'var(--primary)' }}>({myPosts.length})</span>
        </h3>

        {loading ? (
          <div className="loading"><div className="loading-ring" />불러오는 중...</div>
        ) : myPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: 13 }}>
            아직 작성한 게시글이 없습니다.<br />
            <Link to="/posts/new" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16, fontSize: 13 }}>
              첫 글 작성하기
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myPosts.map(post => (
              <Link key={post.id} to={`/posts/${post.id}`} className="post-card" style={{ textDecoration: 'none', display: 'block' }}>
                <div className="post-card-top">
                  <span className="badge badge-category">{CATEGORY_LABELS[post.category as keyof typeof CATEGORY_LABELS] ?? post.category}</span>
                  <span className="post-card-time" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <div className="post-card-title">{post.title}</div>
                <div className="post-card-meta">
                  <span>👁 {post.viewCount}</span>
                  <span>👍 {post.likeCount}</span>
                  <span>💬 {post.commentCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
