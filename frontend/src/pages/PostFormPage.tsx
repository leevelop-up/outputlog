import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api/posts'
import type { PostCategory, PostCreateRequest } from '@/types'
import { useEffect } from 'react'

const schema = z.object({
  title:     z.string().min(1, '제목을 입력하세요').max(200),
  content:   z.string().min(1, '내용을 입력하세요'),
  category:  z.enum(['DISCUSSION','QUESTION','SHOWCASE','NEWS','TUTORIAL','GITHUB'] as const),
  tags:      z.string().optional(),
  sourceUrl: z.string().url('올바른 URL 형식으로 입력하세요').optional().or(z.literal('')),
})
type F = z.infer<typeof schema>

export default function PostFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: post } = useQuery({
    queryKey: ['post', Number(id)],
    queryFn: () => postsApi.getById(Number(id)),
    enabled: isEdit,
  })

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'DISCUSSION' },
  })

  const category = useWatch({ control, name: 'category' })

  useEffect(() => {
    if (post) reset({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      sourceUrl: post.sourceUrl ?? '',
    })
  }, [post, reset])

  const mut = useMutation({
    mutationFn: (d: PostCreateRequest) => isEdit ? postsApi.update(Number(id), d) : postsApi.create(d),
    onSuccess: p => p?.id ? navigate(`/posts/${p.id}`) : navigate('/posts'),
  })

  const onSubmit = (d: F) => mut.mutate({
    title: d.title,
    content: d.content,
    category: d.category as PostCategory,
    tags: d.tags ? d.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    sourceUrl: d.sourceUrl || undefined,
  })

  return (
    <div className="post-form-page">
      <h1 className="post-form-title">{isEdit ? 'edit post' : 'new post'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">category</label>
          <select {...register('category')} className="form-select">
            <option value="DISCUSSION">💬 토론</option>
            <option value="QUESTION">❓ 질문</option>
            <option value="SHOWCASE">🚀 쇼케이스</option>
            <option value="NEWS">📡 AI 소식</option>
            <option value="TUTORIAL">📖 튜토리얼</option>
            <option value="GITHUB">🐙 GitHub 레포</option>
          </select>
        </div>

        {category === 'GITHUB' && (
          <div className="form-group">
            <label className="form-label">
              GitHub URL
              <span className="form-label-hint">// 레포지토리 주소</span>
            </label>
            <input
              {...register('sourceUrl')}
              className="form-input"
              placeholder="https://github.com/user/repo"
            />
            {errors.sourceUrl && <span className="form-error">{errors.sourceUrl.message}</span>}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">title</label>
          <input {...register('title')} className="form-input" placeholder="제목을 입력하세요" />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">
            content
            <span className="form-label-hint">// markdown supported</span>
          </label>
          <textarea
            {...register('content')}
            className="form-textarea"
            rows={18}
            placeholder={category === 'GITHUB'
              ? '## 소개\n\n레포지토리에 대한 설명을 입력하세요.\n\n## 주요 기능\n\n- 기능 1\n- 기능 2'
              : '## 제목\n\n내용을 입력하세요.\n\n```python\nprint("Hello!")\n```'}
          />
          {errors.content && <span className="form-error">{errors.content.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">
            tags
            <span className="form-label-hint">// comma separated</span>
          </label>
          <input {...register('tags')} className="form-input" placeholder="Python, AI, LLM" />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? '...' : isEdit ? '→ update' : '→ publish'}
          </button>
        </div>
      </form>
    </div>
  )
}
