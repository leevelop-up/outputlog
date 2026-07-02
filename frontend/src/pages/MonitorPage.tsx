import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import client from '@/api/client'

interface Metrics {
  jvm: { heapUsedMB: number; heapMaxMB: number; heapCommitMB: number; heapUsedPct: number }
  system: {
    availableProcessors: number; loadAverage: number
    totalMemMB?: number; freeMemMB?: number; usedMemMB?: number; memUsedPct?: number
    cpuLoadPct?: number; processCpuPct?: number
    osName: string; osVersion: string; arch: string
  }
  runtime: { uptimeMs: number; uptimeMin: number; uptimeHr: number }
  db: { totalPosts: number; totalUsers: number; totalComments: number }
  threads: { threadCount: number; peakThreadCount: number; daemonThreadCount: number }
  timestamp: number
}

function Gauge({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const danger = pct >= 85
  const warn = pct >= 65
  const barColor = danger ? '#e74c3c' : warn ? '#f39c12' : color
  return (
    <div className="monitor-gauge">
      <div className="monitor-gauge-head">
        <span className="monitor-gauge-label">{label}</span>
        <span className="monitor-gauge-value" style={{ color: barColor }}>
          {value.toLocaleString()}{unit} <span className="monitor-gauge-pct">({pct}%)</span>
        </span>
      </div>
      <div className="monitor-bar-bg">
        <div className="monitor-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: string }) {
  return (
    <div className="monitor-stat-card">
      <div className="monitor-stat-icon">{icon}</div>
      <div className="monitor-stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="monitor-stat-label">{label}</div>
      {sub && <div className="monitor-stat-sub">{sub}</div>}
    </div>
  )
}

function formatUptime(min: number) {
  if (min < 60) return `${min}분`
  if (min < 1440) return `${Math.floor(min / 60)}시간 ${min % 60}분`
  return `${Math.floor(min / 1440)}일 ${Math.floor((min % 1440) / 60)}시간`
}

export default function MonitorPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role !== 'ADMIN') navigate('/')
  }, [user])

  const { data, isLoading, error, dataUpdatedAt } = useQuery<Metrics>({
    queryKey: ['monitor'],
    queryFn: () => client.get('/admin/monitor').then(r => r.data),
    refetchInterval: 5000,
    enabled: user?.role === 'ADMIN',
  })

  if (user?.role !== 'ADMIN') return null

  return (
    <div className="monitor-page">
      <div className="monitor-header">
        <h1 className="monitor-title">서버 모니터링</h1>
        <div className="monitor-status">
          {isLoading ? (
            <span className="monitor-badge loading">로딩 중...</span>
          ) : error ? (
            <span className="monitor-badge error">오류</span>
          ) : (
            <span className="monitor-badge ok">정상</span>
          )}
          {dataUpdatedAt > 0 && (
            <span className="monitor-updated">
              업데이트: {new Date(dataUpdatedAt).toLocaleTimeString('ko-KR')} (5초마다 갱신)
            </span>
          )}
        </div>
      </div>

      {!data && !isLoading && (
        <div className="monitor-error">데이터를 불러올 수 없습니다.</div>
      )}

      {data && (
        <>
          {/* DB 통계 */}
          <section className="monitor-section">
            <h2 className="monitor-section-title">// DB 통계</h2>
            <div className="monitor-stat-grid">
              <StatCard icon="📝" label="총 게시글" value={data.db.totalPosts} />
              <StatCard icon="👥" label="총 회원수" value={data.db.totalUsers} />
              <StatCard icon="💬" label="총 댓글수" value={data.db.totalComments} />
              <StatCard icon="⏱" label="서버 가동시간" value={formatUptime(data.runtime.uptimeMin)} sub={`${data.runtime.uptimeHr}시간`} icon2="🚀" />
            </div>
          </section>

          {/* CPU / 시스템 메모리 */}
          <section className="monitor-section">
            <h2 className="monitor-section-title">// CPU · 시스템 메모리</h2>
            <div className="monitor-gauges">
              {data.system.cpuLoadPct !== undefined && (
                <Gauge label="시스템 CPU" value={data.system.cpuLoadPct} max={100} unit="%" color="#6c63ff" />
              )}
              {data.system.processCpuPct !== undefined && (
                <Gauge label="프로세스 CPU" value={data.system.processCpuPct} max={100} unit="%" color="#a29bfe" />
              )}
              {data.system.usedMemMB !== undefined && data.system.totalMemMB !== undefined && (
                <Gauge label="시스템 메모리" value={data.system.usedMemMB} max={data.system.totalMemMB} unit=" MB" color="#00b894" />
              )}
              <div className="monitor-info-row">
                <span>CPU 코어: {data.system.availableProcessors}</span>
                <span>로드 평균: {data.system.loadAverage?.toFixed(2) ?? '-'}</span>
                <span>{data.system.osName} {data.system.osVersion} ({data.system.arch})</span>
              </div>
            </div>
          </section>

          {/* JVM 힙 메모리 */}
          <section className="monitor-section">
            <h2 className="monitor-section-title">// JVM 힙 메모리</h2>
            <div className="monitor-gauges">
              <Gauge label="힙 사용량" value={data.jvm.heapUsedMB} max={data.jvm.heapMaxMB} unit=" MB" color="#fdcb6e" />
              <div className="monitor-info-row">
                <span>사용: {data.jvm.heapUsedMB} MB</span>
                <span>커밋: {data.jvm.heapCommitMB} MB</span>
                <span>최대: {data.jvm.heapMaxMB} MB</span>
              </div>
            </div>
          </section>

          {/* 스레드 */}
          <section className="monitor-section">
            <h2 className="monitor-section-title">// 스레드</h2>
            <div className="monitor-stat-grid">
              <StatCard icon="🧵" label="현재 스레드" value={data.threads.threadCount} />
              <StatCard icon="📈" label="최대 스레드 (Peak)" value={data.threads.peakThreadCount} />
              <StatCard icon="👻" label="데몬 스레드" value={data.threads.daemonThreadCount} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
