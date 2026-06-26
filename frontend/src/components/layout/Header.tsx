import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

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
            <>
              <Link to="/login"  className={cls('/login')}>login</Link>
              <Link to="/signup" className="nav-link nav-new">signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
