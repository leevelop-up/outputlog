import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import client from '@/api/client'

const JOB_OPTIONS = [
  '프론트엔드 개발자',
  '백엔드 개발자',
  '풀스택 개발자',
  '모바일 개발자 (iOS/Android)',
  'AI / ML 엔지니어',
  'DevOps / 인프라 엔지니어',
  '데이터 엔지니어',
  '게임 개발자',
  '임베디드 / 시스템 개발자',
  '보안 엔지니어',
  'QA 엔지니어',
  '학생 / 취준생',
  '비개발자',
]

export default function SetupProfilePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const token = params.get('token') ?? localStorage.getItem('accessToken') ?? ''
  const refreshToken = params.get('refreshToken') ?? localStorage.getItem('refreshToken') ?? ''

  const [form, setForm] = useState({ nickname: '', job: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nickname.trim()) { setError('닉네임을 입력해주세요.'); return }
    if (form.nickname.trim().length < 2) { setError('닉네임은 2자 이상이어야 합니다.'); return }
    if (!form.job) { setError('직군을 선택해주세요.'); return }
    if (form.password && form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return }
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return }

    setSaving(true)
    try {
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)

      const setupRes = await client.post('/users/setup', {
        nickname: form.nickname.trim(),
        job: form.job,
        password: form.password || undefined,
      })

      const meRes = await client.get('/auth/me')
      login(meRes.data, token, refreshToken)
      navigate('/')
    } catch (e: any) {
      setError(e.response?.data?.message ?? '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: 480 }}>
        <h1 className="auth-box-title" style={{ marginBottom: 6 }}>프로필 설정</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
          // OutputLog 첫 로그인 — 기본 정보를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="form">
          {/* 닉네임 */}
          <div className="form-group">
            <label className="form-label">닉네임 *</label>
            <input
              className="form-input"
              value={form.nickname}
              onChange={e => set('nickname', e.target.value)}
              placeholder="커뮤니티에서 사용할 이름"
              maxLength={30}
              autoFocus
            />
          </div>

          {/* 직군 */}
          <div className="form-group">
            <label className="form-label">현재 하시는 일 *</label>
            <select
              className="form-input"
              value={form.job}
              onChange={e => set('job', e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">-- 선택해주세요 --</option>
              {JOB_OPTIONS.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* 구분선 */}
          <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0', paddingTop: 16 }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 12 }}>
              // 비밀번호 설정 (선택 — 이메일 로그인도 사용하려면 입력)
            </p>
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label className="form-label">비밀번호 (선택)</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="8자 이상"
              autoComplete="new-password"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group">
            <label className="form-label">비밀번호 확인</label>
            <input
              className="form-input"
              type="password"
              value={form.passwordConfirm}
              onChange={e => set('passwordConfirm', e.target.value)}
              placeholder="비밀번호를 다시 입력"
              autoComplete="new-password"
            />
          </div>

          {error && <span className="form-error">{error}</span>}

          <button type="submit" className="btn btn-primary w-full" disabled={saving} style={{ marginTop: 8 }}>
            {saving ? '저장 중...' : '→ 시작하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
