import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'OutputLog'
const BASE_URL  = 'https://outputlog.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

interface Props {
  title?: string
  description?: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  keywords?: string
}

export default function SEO({
  title,
  description = 'AI·웹개발·백엔드·프론트엔드·DevOps 등 모든 개발 관련 질문·토론·뉴스를 공유하는 개발자 커뮤니티입니다.',
  url = BASE_URL,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedAt,
  keywords,
}: Props) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — 개발자 커뮤니티`
  const canonical = url.startsWith('http') ? url : `${BASE_URL}${url}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="ko_KR" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />

      {/* Article 전용 */}
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
    </Helmet>
  )
}
