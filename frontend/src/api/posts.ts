import client from './client'
import type { Post, PostCreateRequest, PageResponse } from '@/types'

export const postsApi = {
  getList: (params?: { category?: string; keyword?: string; page?: number; size?: number }) =>
    client.get<PageResponse<Post>>('/posts', { params }).then((r) => r.data),

  getById: (id: number) =>
    client.get<Post>(`/posts/${id}`).then((r) => r.data),

  create: (data: PostCreateRequest) =>
    client.post<Post>('/posts', data).then((r) => r.data),

  update: (id: number, data: PostCreateRequest) =>
    client.put<Post>(`/posts/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    client.delete(`/posts/${id}`),

  toggleLike: (id: number) =>
    client.post<{ liked: boolean }>(`/posts/${id}/like`).then((r) => r.data),
}
