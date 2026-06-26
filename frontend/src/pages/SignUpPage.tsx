import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'

const schema = z.object({
  email:    z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '최소 8자 이상이어야 합니다'),
  nickname: z.string().min(2, '최소 2자 이상').max(30),
})
type F = z.infer<typeof schema>

export default function SignUpPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    try {
      await authApi.signUp(data)
      navigate('/login')
    } catch (err: any) {
      setError('root', { message: err.response?.data?.message || '오류가 발생했습니다.' })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-box-title">signup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label className="form-label">email</label>
            <input {...register('email')} className="form-input" type="email" placeholder="user@example.com" />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">password</label>
            <input {...register('password')} className="form-input" type="password" placeholder="min. 8 characters" />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">nickname</label>
            <input {...register('nickname')} className="form-input" type="text" placeholder="your_handle" />
            {errors.nickname && <span className="form-error">{errors.nickname.message}</span>}
          </div>
          {errors.root && <span className="form-error">{errors.root.message}</span>}
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? 'creating...' : '→ create account'}
          </button>
        </form>
        <p className="auth-foot">이미 계정이 있으신가요? <Link to="/login">login →</Link></p>
      </div>
    </div>
  )
}
