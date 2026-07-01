import client from './client'
import type { ShopItem } from '@/types'

export const shopApi = {
  getItems: () => client.get<ShopItem[]>('/shop/items').then(r => r.data),
  getMyItems: () => client.get<ShopItem[]>('/shop/my-items').then(r => r.data),
  getEquipped: (userId: number) => client.get<ShopItem[]>(`/shop/users/${userId}/equipped`).then(r => r.data),
  buy: (id: number) => client.post(`/shop/items/${id}/buy`).then(r => r.data),
  equip: (id: number) => client.put<{ equipped: string }>(`/shop/items/${id}/equip`).then(r => r.data),
}
