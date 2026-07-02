import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span className="footer-dot" />
        OutputLog © 2025
      </footer>
    </div>
  )
}
