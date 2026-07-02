import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shopApi } from '@/api/shop'
import { useAuthStore } from '@/store/authStore'
import type { ShopItem } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  HAT: '모자', SHIRT: '옷', ACCESSORY: '장신구', BACKGROUND: '배경',
}
const TABS = ['전체', '모자', '옷', '장신구', '배경'] as const
const TAB_KEYS: Record<string, string | null> = {
  '전체': null, '모자': 'HAT', '옷': 'SHIRT', '장신구': 'ACCESSORY', '배경': 'BACKGROUND',
}

export default function ShopPage() {
  const { user, setUser } = useAuthStore()
  const qc = useQueryClient()
  const [tab, setTab] = useState<typeof TABS[number]>('전체')
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const { data: items = [] } = useQuery({
    queryKey: ['shop-items'],
    queryFn: shopApi.getItems,
    enabled: !!user,
  })
  const { data: myItems = [] } = useQuery({
    queryKey: ['my-items'],
    queryFn: shopApi.getMyItems,
    enabled: !!user,
  })

  const equippedItems = myItems.filter(i => i.equipped)
  void equippedItems

  const buyMut = useMutation({
    mutationFn: shopApi.buy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shop-items'] })
      qc.invalidateQueries({ queryKey: ['my-items'] })
      // 포인트 차감 반영을 위해 유저 정보 갱신
      import('@/api/client').then(({ default: client }) =>
        client.get('/users/me').then(r => setUser(r.data))
      )
      flash('구매 완료!', true)
    },
    onError: (e: any) => flash(e?.response?.data?.message || '구매 실패', false),
  })

  const equipMut = useMutation({
    mutationFn: shopApi.equip,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shop-items'] })
      qc.invalidateQueries({ queryKey: ['my-items'] })
    },
    onError: () => flash('장착 실패', false),
  })

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 2500)
  }

  const filtered = TAB_KEYS[tab]
    ? items.filter(i => i.type === TAB_KEYS[tab])
    : items

  if (!user) return (
    <div className="shop-empty">로그인 후 이용할 수 있습니다.</div>
  )

  return (
    <div className="shop-page" style={{ display: 'block' }}>
      {msg && (
        <div className={`shop-toast ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>
      )}

      {/* 포인트 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="shop-title" style={{ margin: 0 }}>아이템 상점</h2>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--primary)', fontWeight: 700 }}>
          ⭐ {user.points.toLocaleString()} pts 보유
        </span>
      </div>

      <div className="shop-main">
        <div className="shop-tabs">
          {TABS.map(t => (
            <button key={t} className={`shop-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className="shop-grid">
          {filtered.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              userPts={user.points}
              onBuy={() => buyMut.mutate(item.id)}
              onEquip={() => equipMut.mutate(item.id)}
              buying={buyMut.isPending}
              equipping={equipMut.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ItemCard({ item, userPts, onBuy, onEquip, buying, equipping }: {
  item: ShopItem
  userPts: number
  onBuy: () => void
  onEquip: () => void
  buying: boolean
  equipping: boolean
}) {
  const canAfford = userPts >= item.price
  return (
    <div className={`shop-item-card ${item.owned ? 'owned' : ''} ${item.equipped ? 'equipped' : ''}`}>
      <div className="shop-item-type-badge">{TYPE_LABELS[item.type]}</div>
      <div className="shop-item-icon">{getItemIcon(item.itemKey)}</div>
      <div className="shop-item-name">{item.name}</div>
      <div className="shop-item-desc">{item.description}</div>
      <div className="shop-item-price">
        {item.price === 0 ? '무료' : `⭐ ${item.price}`}
      </div>
      {item.equipped ? (
        <button className="shop-btn equipped" onClick={onEquip} disabled={equipping}>✓ 장착 중</button>
      ) : item.owned ? (
        <button className="shop-btn equip" onClick={onEquip} disabled={equipping}>장착하기</button>
      ) : (
        <button
          className={`shop-btn buy ${!canAfford ? 'disabled' : ''}`}
          onClick={onBuy}
          disabled={buying || !canAfford}
        >
          {canAfford ? '구매하기' : '포인트 부족'}
        </button>
      )}
    </div>
  )
}

function getItemIcon(key: string): string {
  const map: Record<string, string> = {
    hat_baseball: '🧢', hat_crown: '👑', hat_headset: '🎧',
    hat_wizard: '🧙', hat_beanie: '🪖',
    shirt_hoodie: '👕', shirt_suit: '👔', shirt_space: '🚀',
    shirt_ninja: '🥷', shirt_hawaii: '🌺',
    acc_glasses: '👓', acc_sunglasses: '🕶️', acc_coffee: '☕',
    acc_laptop: '💻', acc_sword: '⚔️', acc_mic: '🎙️',
    bg_matrix: '💚', bg_space: '🌌', bg_forest: '🌲',
    bg_city: '🌃', bg_sunset: '🌅',
  }
  return map[key] || '🎁'
}
