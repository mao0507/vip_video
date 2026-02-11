// VIP 等級常數
export const VipLevel = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5,
  LEVEL_6: 6,
} as const

// VIP 等級標籤對應表
export const VipLevelLabels: Record<number, string> = {
  1: 'VIP 1',
  2: 'VIP 2',
  3: 'VIP 3',
  4: 'VIP 4',
  5: 'VIP 5',
  6: 'VIP 6',
}

// VIP 等級選項陣列
export const VipLevelOptions = [
  { value: 1, label: 'VIP 1' },
  { value: 2, label: 'VIP 2' },
  { value: 3, label: 'VIP 3' },
  { value: 4, label: 'VIP 4' },
  { value: 5, label: 'VIP 5' },
  { value: 6, label: 'VIP 6' },
]

// 嵌入類型選項
export const EmbedTypeOptions = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'google_drive', label: 'Google Drive' },
]
