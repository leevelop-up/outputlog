import client from './client'
import type { LoginRequest, SignUpRequest, TokenResponse, UserResponse } from '@/types'

export const authApi = {
  signUp: (data: SignUpRequest) =>
    client.post<UserResponse>('/auth/signup', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    client.post<TokenResponse>('/auth/login', data).then((r) => r.data),

  logout: () => client.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    client.post<TokenResponse>('/auth/refresh', null, {
      headers: { 'X-Refresh-Token': refreshToken },
    }).then((r) => r.data),
}
