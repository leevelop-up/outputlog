import type { PostCategory } from '@/types'

export const CATEGORY_LABELS: Record<PostCategory | '', string> = {
  '':         '전체',
  QUESTION:   '질문',
  NEWS:       '최신뉴스',
  SHOWCASE:   '프로젝트',
  GITHUB:     'GitHub',
  DISCUSSION: '자유게시판',
  TUTORIAL:   '튜토리얼',
}

export const MAIN_CATEGORIES: { key: PostCategory; label: string; icon: string; path: string; color: string; desc: string }[] = [
  { key: 'QUESTION', label: '질문',    icon: '', path: '/question', color: '#f0a500',       desc: '궁금한 것을 물어보세요' },
  { key: 'NEWS',     label: '최신뉴스', icon: '', path: '/news',     color: 'var(--green)',  desc: 'AI · 개발 최신 소식' },
  { key: 'SHOWCASE', label: '프로젝트', icon: '', path: '/projects', color: 'var(--primary)', desc: '만든 것을 공유하세요' },
  { key: 'GITHUB',   label: 'GitHub',  icon: '', path: '/github',   color: '#8b949e',       desc: '오픈소스 & 트렌딩' },
]
