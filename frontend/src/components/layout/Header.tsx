import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { useEffect, useState } from 'react'
import client from '@/api/client'
import { MAIN_CATEGORIES } from '@/constants/categories'

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return { theme, toggle }
}

export default function Header() {
  const { user, isAuthenticated, logout, setUser } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    if (isAuthenticated && !user?.nickname) {
      client.get('/auth/me').then(res => setUser(res.data)).catch(() => {})
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    try { await authApi.logout() } finally { logout(); navigate('/') }
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')
  const cls = (path: string) => `nav-link${isActive(path) ? ' active' : ''}`
  const displayName = user?.nickname || user?.email?.split('@')[0] || 'my page'

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-cursor" />
          OutputLog
        </Link>

        <nav className="header-nav">
          {MAIN_CATEGORIES.map(cat => (
            <Link key={cat.key} to={cat.path} className={cls(cat.path)}>
              {cat.icon} {cat.label}
            </Link>
          ))}
          <Link to="/mcp" className={cls('/mcp')}>MCP</Link>

          {isAuthenticated ? (
            <>
              <Link to="/posts/new" className="nav-link nav-new">＋ 글쓰기</Link>
              <Link to="/mypage" className={cls('/mypage')}>{displayName}</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className={cls('/admin')} title="관리자">⚙</Link>
              )}
              <button onClick={handleLogout} className="nav-link nav-out">logout</button>
            </>
          ) : (
            <Link to="/login" className={cls('/login')}>login</Link>
          )}

          <button onClick={toggle} className="nav-link theme-toggle" title="테마 전환">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </nav>
      </div>
    </header>
  )
}
