export const VIP_LEVELS = {
  FREE: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  DIAMOND: 6,
} as const;

export const VIP_LEVEL_NAMES: Record<number, string> = {
  1: '免費會員',
  2: '銅牌會員',
  3: '銀牌會員',
  4: '金牌會員',
  5: '白金會員',
  6: '鑽石會員',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const VIP_LEVEL_KEY = 'vipLevel';
