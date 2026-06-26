import type { PostCategory } from '@/types'

export const CATEGORY_LABELS: Record<PostCategory | '', string> = {
  '':           '전체',
  DISCUSSION:   '토론',
  QUESTION:     '질문',
  SHOWCASE:     '쇼케이스',
  NEWS:         'AI 소식',
  TUTORIAL:     '튜토리얼',
}
