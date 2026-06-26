import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email:    z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})
type F = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    try {
      const res = await authApi.login(data)
      login(res.user, res.accessToken, res.refreshToken)
      navigate('/')
    } catch {
      setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-box-title">login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label className="form-label">email</label>
            <input {...register('email')} className="form-input" type="email" placeholder="user@example.com" autoComplete="email" />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">password</label>
            <input {...register('password')} className="form-input" type="password" placeholder="••••••••" autoComplete="current-password" />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>
          {errors.root && <span className="form-error">{errors.root.message}</span>}
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? 'logging in...' : '→ login'}
          </button>
        </form>
        <p className="auth-foot">계정이 없으신가요? <Link to="/signup">signup →</Link></p>
      </div>
    </div>
  )
}
