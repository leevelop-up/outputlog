import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { useEffect, useState } from 'react'
import client from '@/api/client'

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

  // 앱 로드 시 인증된 상태면 최신 user 데이터로 갱신
  useEffect(() => {
    if (isAuthenticated && !user?.nickname) {
      client.get('/auth/me').then(res => setUser(res.data)).catch(() => {})
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    try { await authApi.logout() } finally { logout(); navigate('/') }
  }

  const cls = (path: string) => `nav-link${pathname === path ? ' active' : ''}`
  const displayName = user?.nickname || user?.email?.split('@')[0] || 'my page'

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-cursor" />
          OutputLog
        </Link>

        <nav className="header-nav">
          <Link to="/posts" className={cls('/posts')}>posts</Link>

          {isAuthenticated ? (
            <>
              <Link to="/posts/new" className="nav-link nav-new">＋ new post</Link>
              <Link to="/mypage" className={cls('/mypage')}>{displayName}</Link>
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
