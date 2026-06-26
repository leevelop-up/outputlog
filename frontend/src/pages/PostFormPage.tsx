import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api/posts'
import type { PostCategory, PostCreateRequest } from '@/types'
import { useEffect } from 'react'

const schema = z.object({
  title:    z.string().min(1, '제목을 입력하세요').max(200),
  content:  z.string().min(1, '내용을 입력하세요'),
  category: z.enum(['DISCUSSION','QUESTION','SHOWCASE','NEWS','TUTORIAL'] as const),
  tags:     z.string().optional(),
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

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'DISCUSSION' },
  })

  useEffect(() => {
    if (post) reset({ title: post.title, content: post.content, category: post.category, tags: post.tags.join(', ') })
  }, [post, reset])

  const mut = useMutation({
    mutationFn: (d: PostCreateRequest) => isEdit ? postsApi.update(Number(id), d) : postsApi.create(d),
    onSuccess: p => navigate(`/posts/${p.id}`),
  })

  const onSubmit = (d: F) => mut.mutate({
    title: d.title, content: d.content,
    category: d.category as PostCategory,
    tags: d.tags ? d.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
  })

  return (
    <div className="post-form-page">
      <h1 className="post-form-title">{isEdit ? 'edit post' : 'new post'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="form-label">category</label>
          <select {...register('category')} className="form-select">
            <option value="DISCUSSION">discussion</option>
            <option value="QUESTION">question</option>
            <option value="SHOWCASE">showcase</option>
            <option value="NEWS">news</option>
            <option value="TUTORIAL">tutorial</option>
          </select>
        </div>
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
          <textarea {...register('content')} className="form-textarea" rows={18}
            placeholder={'## 제목\n\n내용을 입력하세요.\n\n```python\nprint("Hello, AI!")\n```'} />
          {errors.content && <span className="form-error">{errors.content.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">
            tags
            <span className="form-label-hint">// comma separated</span>
          </label>
          <input {...register('tags')} className="form-input" placeholder="GPT, LLM, Python, AI" />
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
