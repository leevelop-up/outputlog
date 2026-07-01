export interface LevelInfo {
  level: number
  title: string
  color: string
  icon: string
  nextPts: number | null
  progress: number // 0~100
}

const LEVELS = [
  { min: 0,    title: '새싹',      color: '#55efc4', icon: '🌱' },
  { min: 100,  title: '주니어',    color: '#74b9ff', icon: '💻' },
  { min: 300,  title: '개발자',    color: '#a29bfe', icon: '⚡' },
  { min: 700,  title: '시니어',    color: '#fd79a8', icon: '🔥' },
  { min: 1500, title: '리드',      color: '#e17055', icon: '🚀' },
  { min: 3000, title: '아키텍트',  color: '#f9ca24', icon: '🏆' },
  { min: 6000, title: '레전드',    color: '#ff7675', icon: '👑' },
]

export function getLevelInfo(points: number): LevelInfo {
  let idx = 0
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].min) { idx = i; break }
  }
  const cur = LEVELS[idx]
  const next = LEVELS[idx + 1] ?? null
  const prevMin = cur.min
  const nextMin = next?.min ?? prevMin
  const progress = next
    ? Math.round(((points - prevMin) / (nextMin - prevMin)) * 100)
    : 100

  return {
    level: idx + 1,
    title: cur.title,
    color: cur.color,
    icon: cur.icon,
    nextPts: next ? next.min : null,
    progress,
  }
}

export function getBadges(points: number, postCount?: number): { label: string; color: string }[] {
  const badges = []
  if (points >= 100)  badges.push({ label: '첫 100pts', color: '#74b9ff' })
  if (points >= 1000) badges.push({ label: '1K 클럽',   color: '#a29bfe' })
  if (points >= 5000) badges.push({ label: '5K 엘리트', color: '#f9ca24' })
  if (postCount && postCount >= 10)  badges.push({ label: '10글 달성', color: '#55efc4' })
  if (postCount && postCount >= 50)  badges.push({ label: '50글 마스터', color: '#fd79a8' })
  return badges
}
