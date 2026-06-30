import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import client from '@/api/client'

export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  useEffect(() => {
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')
    const error = params.get('error')

    if (error) {
      navigate('/login?error=' + error)
      return
    }

    const setup = params.get('setup') === 'true'

    if (token && refreshToken) {
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)

      if (setup) {
        navigate(`/setup-profile?token=${token}&refreshToken=${refreshToken}`)
        return
      }

      client.get('/auth/me').then(res => {
        login(res.data, token, refreshToken)
        navigate('/')
      }).catch(() => {
        navigate('/login')
      })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <div className="loading"><div className="loading-ring" />로그인 처리 중...</div>
      </div>
    </div>
  )
}
