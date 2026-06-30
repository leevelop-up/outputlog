import client from './client'
import type { PageResponse } from '@/types'

export interface AdminStats {
  totalUsers: number
  totalPosts: number
  totalComments: number
  adminCount: number
  activeUsers: number
}

export interface AdminUser {
  id: number
  email: string
  nickname: string
  role: 'USER' | 'ADMIN'
  provider: string | null
  active: boolean
  createdAt: string
}

export interface AdminPost {
  id: number
  title: string
  category: string
  viewCount: number
  likeCount: number
  commentCount: number
  author: { id: number; nickname: string }
  createdAt: string
}

export const adminApi = {
  getStats: () =>
    client.get<AdminStats>('/admin/stats').then(r => r.data),

  getUsers: (params?: { page?: number; size?: number; keyword?: string }) =>
    client.get<PageResponse<AdminUser>>('/admin/users', { params }).then(r => r.data),

  updateRole: (id: number, role: 'USER' | 'ADMIN') =>
    client.patch<AdminUser>(`/admin/users/${id}/role`, { role }).then(r => r.data),

  updateActive: (id: number, active: boolean) =>
    client.patch<AdminUser>(`/admin/users/${id}/active`, { active }).then(r => r.data),

  getPosts: (params?: { page?: number; size?: number; category?: string; keyword?: string }) =>
    client.get<PageResponse<AdminPost>>('/admin/posts', { params }).then(r => r.data),

  deletePost: (id: number) =>
    client.delete(`/admin/posts/${id}`),
}
