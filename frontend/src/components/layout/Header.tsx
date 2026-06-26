import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { useEffect, useState } from 'react'

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return { theme, toggle }
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()

  const handleLogout = async () => {
    try { await authApi.logout() } finally { logout(); navigate('/') }
  }

  const cls = (path: string) => `nav-link${pathname === path ? ' active' : ''}`

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
              <Link to="/profile" className={cls('/profile')}>{user?.nickname}</Link>
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
