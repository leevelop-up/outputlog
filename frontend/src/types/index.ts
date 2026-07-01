export interface UserResponse {
  id: number
  email: string
  nickname: string
  bio?: string
  profileImage?: string
  role: 'USER' | 'ADMIN'
  provider?: string
  points: number
  githubUrl?: string
  websiteUrl?: string
  createdAt: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: UserResponse
}

export interface SignUpRequest {
  email: string
  password: string
  nickname: string
}

export interface LoginRequest {
  email: string
  password: string
}

export type PostCategory = 'DISCUSSION' | 'QUESTION' | 'SHOWCASE' | 'NEWS' | 'TUTORIAL' | 'GITHUB'

export interface Post {
  id: number
  title: string
  content: string
  sourceUrl?: string
  category: PostCategory
  viewCount: number
  likeCount: number
  likedByMe: boolean
  author: UserResponse
  tags: string[]
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface PostCreateRequest {
  title: string
  content: string
  category: PostCategory
  tags?: string[]
  sourceUrl?: string
}

export interface Comment {
  id: number
  content: string
  author: UserResponse
  replies: Comment[]
  likeCount: number
  createdAt: string
  updatedAt: string
}

export interface CommentCreateRequest {
  content: string
  parentId?: number
}

export interface ShopItem {
  id: number
  name: string
  description: string
  type: 'HAT' | 'SHIRT' | 'ACCESSORY' | 'BACKGROUND'
  price: number
  itemKey: string
  owned: boolean
  equipped: boolean
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}
