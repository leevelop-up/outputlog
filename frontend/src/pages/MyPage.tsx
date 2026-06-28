import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import client from '@/api/client'
import type { Post } from '@/types'
import { CATEGORY_LABELS } from '@/constants/categories'

interface ProfileUpdateForm {
  nickname: string
  bio: string
}

export default function MyPage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileUpdateForm>({ nickname: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setForm({ nickname: user?.nickname ?? '', bio: user?.bio ?? '' })
    loadMyPosts()
  }, [isAuthenticated])

  const loadMyPosts = async () => {
    try {
      const res = await client.get('/posts/my')
      setMyPosts(res.data.content ?? res.data)
    } catch {
      // 엔드포인트 없으면 전체에서 필터
      try {
        const res = await client.get('/posts', { params: { size: 100 } })
        const posts = (res.data.content ?? res.data).filter(
          (p: Post) => p.author?.nickname === user?.nickname
        )
        setMyPosts(posts)
      } catch {}
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
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  {user?.bio || '소개가 없습니다.'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                  {user?.email}
                </p>
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
                color: 'var(--text-muted)', fontSize: 12, padding: '5px 14px', cursor: 'pointer'
              }}>
                로그아웃
              </button>
            </div>
          )}
        </div>
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
