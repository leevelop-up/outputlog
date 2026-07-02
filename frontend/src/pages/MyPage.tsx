import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import client from '@/api/client'
import { getLevelInfo, getBadges } from '@/utils/level'
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

  const levelInfo = getLevelInfo(user?.points ?? 0)
  const badges = getBadges(user?.points ?? 0, myPosts.length)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
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
      setMyPosts(content.filter(p => p.author?.nickname === user?.nickname))
    } catch { setMyPosts([]) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!form.nickname.trim()) { setError('닉네임을 입력해주세요.'); return }
    setSaving(true); setError('')
    try {
      const res = await client.put('/users/me', form)
      setUser(res.data); setEditing(false)
    } catch (e: any) {
      setError(e.response?.data?.message ?? '저장 실패')
    } finally { setSaving(false) }
  }

  const handleLogout = async () => {
    try { await client.post('/auth/logout') } catch {}
    logout(); navigate('/')
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  if (!isAuthenticated) return null

  return (
    <div className="page-container" style={{ maxWidth: 720, padding: '40px 20px' }}>
      {/* 프로필 카드 */}
      <div className="auth-box" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--bg-hover)', border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, flexShrink: 0,
          }}>
            {user?.profileImage
              ? <img src={user.profileImage} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : (user?.nickname?.[0] ?? '?').toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '닉네임', key: 'nickname', placeholder: '', max: 30 },
                  { label: '한 줄 소개', key: 'bio', placeholder: '간단한 자기소개', max: 100 },
                  { label: 'GitHub 주소', key: 'githubUrl', placeholder: 'https://github.com/username', max: 255 },
                  { label: '홈페이지', key: 'websiteUrl', placeholder: 'https://yoursite.com', max: 255 },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-input"
                      value={form[f.key as keyof ProfileUpdateForm]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      maxLength={f.max}
                    />
                  </div>
                ))}
                {error && <span className="form-error">{error}</span>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ fontSize: 13 }}>
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button className="btn" onClick={() => { setEditing(false); setError('') }} style={{ fontSize: 13 }}>취소</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>{user?.nickname}</h2>
                  {user?.provider && (
                    <span style={{ fontSize: 11, background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-muted)' }}>
                      {user.provider === 'github' ? '🐙 GitHub' : '🔵 Google'}
                    </span>
                  )}
                  {/* 레벨 뱃지 */}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 12, background: levelInfo.color, color: '#000' }}>
                    {levelInfo.icon} Lv.{levelInfo.level} {levelInfo.title}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{user?.bio || '소개가 없습니다.'}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>{user?.email}</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {user?.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none' }}>🐙 GitHub</a>
                  )}
                  {user?.websiteUrl && (
                    <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none' }}>🌐 홈페이지</a>
                  )}
                </div>
                {badges.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {badges.map(b => (
                      <span key={b.label} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: b.color, color: '#000' }}>{b.label}</span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {!editing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 'auto' }}>
              <button className="btn" onClick={() => setEditing(true)} style={{ fontSize: 12, padding: '5px 14px' }}>편집</button>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-muted)', fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>로그아웃</button>
            </div>
          )}
        </div>

        {/* 포인트 + 경험치 바 */}
        {!editing && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>
                ⭐ {(user?.points ?? 0).toLocaleString()} pts
              </span>
              {levelInfo.nextPts && (
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                  다음 레벨까지 {(levelInfo.nextPts - (user?.points ?? 0)).toLocaleString()} pts
                </span>
              )}
            </div>
            <div style={{ height: 6, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${levelInfo.progress}%`, background: levelInfo.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
              글 작성 +10pt · 글 삭제 -10pt · <Link to="/shop" style={{ color: 'var(--primary)' }}>상점에서 아이템 구매 →</Link>
            </div>
          </div>
        )}
      </div>

      {/* 내 게시글 */}
      <h3 style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: 1 }}>
        MY POSTS <span style={{ color: 'var(--primary)' }}>({myPosts.length})</span>
      </h3>

      {loading ? (
        <div className="loading"><div className="loading-ring" />불러오는 중...</div>
      ) : myPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: 13 }}>
          아직 작성한 게시글이 없습니다.<br />
          <Link to="/posts/new" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16, fontSize: 13 }}>첫 글 작성하기</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myPosts.map(post => (
            <Link key={post.id} to={`/posts/${post.id}`} className="post-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="post-card-top">
                <span className="badge badge-category">{CATEGORY_LABELS[post.category as keyof typeof CATEGORY_LABELS] ?? post.category}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>{formatDate(post.createdAt)}</span>
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
  )
}
