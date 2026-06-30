import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { adminApi, type AdminUser, type AdminPost } from '@/api/admin'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

type Tab = 'overview' | 'posts' | 'users'

function timeAgo(d: string) {
  return formatDistanceToNow(new Date(d), { addSuffix: true, locale: ko })
}

// ── 통계 카드 ───────────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-icon" style={{ color }}>{icon}</span>
      <div>
        <div className="admin-stat-value">{value.toLocaleString()}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  )
}

// ── 게시글 탭 ───────────────────────────────────────────────

function PostsTab() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', page, search, category],
    queryFn: () => adminApi.getPosts({ page, size: 15, keyword: search || undefined, category: category || undefined }),
  })

  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] }),
  })

  return (
    <div className="admin-section">
      <div className="admin-filter-bar">
        <input
          className="form-input admin-search"
          placeholder="제목 검색..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (setSearch(keyword), setPage(0))}
        />
        <select className="form-input admin-select" value={category} onChange={e => { setCategory(e.target.value); setPage(0) }}>
          <option value="">전체 카테고리</option>
          {['DISCUSSION','QUESTION','SHOWCASE','NEWS','TUTORIAL','GITHUB'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={() => { setSearch(keyword); setPage(0) }}>검색</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>제목</th><th>카테고리</th><th>작성자</th>
              <th>조회</th><th>좋아요</th><th>댓글</th><th>작성일</th><th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="admin-table-empty">로딩 중...</td></tr>
            ) : !data?.content?.length ? (
              <tr><td colSpan={9} className="admin-table-empty">게시글이 없습니다</td></tr>
            ) : data.content.map((p: AdminPost) => (
              <tr key={p.id}>
                <td className="admin-td-id">#{p.id}</td>
                <td className="admin-td-title">
                  <a href={`/posts/${p.id}`} target="_blank" rel="noreferrer">{p.title}</a>
                </td>
                <td><span className={`badge badge-${p.category}`}>{p.category.toLowerCase()}</span></td>
                <td>@{p.author.nickname}</td>
                <td>{p.viewCount}</td>
                <td>{p.likeCount}</td>
                <td>{p.commentCount}</td>
                <td className="admin-td-time">{timeAgo(p.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirm(`#${p.id} 게시글을 삭제할까요?`) && delMut.mutate(p.id)}
                  >삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="admin-pagination">
          <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← 이전</button>
          <span>{page + 1} / {data.totalPages}</span>
          <button className="btn btn-secondary btn-sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>다음 →</button>
        </div>
      )}
    </div>
  )
}

// ── 회원 탭 ────────────────────────────────────────────────

function UsersTab() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => adminApi.getUsers({ page, size: 15, keyword: search || undefined }),
  })

  const roleMut = useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'USER' | 'ADMIN' }) => adminApi.updateRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const activeMut = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => adminApi.updateActive(id, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  return (
    <div className="admin-section">
      <div className="admin-filter-bar">
        <input
          className="form-input admin-search"
          placeholder="닉네임 / 이메일 검색..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (setSearch(keyword), setPage(0))}
        />
        <button className="btn btn-secondary" onClick={() => { setSearch(keyword); setPage(0) }}>검색</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>닉네임</th><th>이메일</th><th>가입 방법</th>
              <th>권한</th><th>상태</th><th>가입일</th><th>관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="admin-table-empty">로딩 중...</td></tr>
            ) : !data?.content?.length ? (
              <tr><td colSpan={8} className="admin-table-empty">회원이 없습니다</td></tr>
            ) : data.content.map((u: AdminUser) => (
              <tr key={u.id}>
                <td className="admin-td-id">#{u.id}</td>
                <td><strong>@{u.nickname}</strong></td>
                <td className="admin-td-email">{u.email}</td>
                <td>
                  <span className="admin-provider">
                    {u.provider === 'github' ? '🐙 GitHub' : u.provider === 'google' ? '🌐 Google' : '🔑 이메일'}
                  </span>
                </td>
                <td>
                  <span className={`admin-role-badge ${u.role === 'ADMIN' ? 'admin' : ''}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`admin-active-badge ${u.active ? 'on' : 'off'}`}>
                    {u.active ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="admin-td-time">{timeAgo(u.createdAt)}</td>
                <td className="admin-td-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => roleMut.mutate({ id: u.id, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                  >{u.role === 'ADMIN' ? 'USER로' : 'ADMIN으로'}</button>
                  <button
                    className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => activeMut.mutate({ id: u.id, active: !u.active })}
                  >{u.active ? '비활성화' : '활성화'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="admin-pagination">
          <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← 이전</button>
          <span>{page + 1} / {data.totalPages}</span>
          <button className="btn btn-secondary btn-sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>다음 →</button>
        </div>
      )}
    </div>
  )
}

// ── 메인 ────────────────────────────────────────────────────

export default function AdminPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')

  if (!user) { navigate('/login'); return null }
  if (user.role !== 'ADMIN') {
    return (
      <div className="empty">
        <div className="empty-icon">🚫</div>
        <div className="empty-msg">// 관리자 권한이 필요합니다</div>
      </div>
    )
  }

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  })

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: '개요', icon: '📊' },
    { key: 'posts',    label: '게시글 관리', icon: '📝' },
    { key: 'users',    label: '회원 관리', icon: '👥' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">⚙️ 관리자 패널</h1>
        <span className="admin-badge">ADMIN</span>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`admin-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="admin-overview">
          <div className="admin-stats-grid">
            <StatCard label="전체 회원" value={stats?.totalUsers ?? 0}    icon="👥" color="var(--primary)" />
            <StatCard label="전체 게시글" value={stats?.totalPosts ?? 0}  icon="📝" color="var(--green)" />
            <StatCard label="전체 댓글" value={stats?.totalComments ?? 0} icon="💬" color="#f0a500" />
            <StatCard label="관리자 수" value={stats?.adminCount ?? 0}    icon="🔑" color="#e74c3c" />
            <StatCard label="활성 회원" value={stats?.activeUsers ?? 0}   icon="✅" color="#27ae60" />
          </div>
          <div className="admin-overview-hint">
            <p>// 탭을 선택해 게시글·회원을 관리하세요.</p>
          </div>
        </div>
      )}

      {tab === 'posts' && <PostsTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  )
}
