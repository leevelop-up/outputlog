import client from './client'
import type { Comment, CommentCreateRequest } from '@/types'

export const commentsApi = {
  getByPostId: (postId: number) =>
    client.get<Comment[]>(`/posts/${postId}/comments`).then((r) => r.data),

  create: (postId: number, data: CommentCreateRequest) =>
    client.post<Comment>(`/posts/${postId}/comments`, data).then((r) => r.data),

  update: (postId: number, commentId: number, content: string) =>
    client.patch<Comment>(`/posts/${postId}/comments/${commentId}`, { content }).then((r) => r.data),

  delete: (postId: number, commentId: number) =>
    client.delete(`/posts/${postId}/comments/${commentId}`),
}
