# Database Schema

VIP 會員平台資料庫 Schema 文件

## 資料表列表

| 檔案 | 資料表 | 說明 |
|------|--------|------|
| `01_users.sql` | `users` | 使用者資料 |
| `02_refresh_tokens.sql` | `refresh_tokens` | JWT 刷新令牌 |
| `03_categories.sql` | `categories` | 影片分類 |
| `04_videos.sql` | `videos` | 影片資料 |
| `05_images.sql` | `images` | 圖片資料 |
| `06_tags.sql` | `tags` | 標籤 |
| `07_video_tags.sql` | `video_tags` | 影片與標籤關聯 |

## 執行順序

由於外鍵關聯，請按照檔案編號順序執行：

```bash
# 使用 Docker 執行
docker exec -i vip-db psql -U postgres -d vip_platform < 00_init.sql
```

或使用完整初始化腳本：

```bash
docker exec -i vip-db psql -U postgres -d vip_platform < 00_init.sql
```

## ER Diagram

```
┌─────────────────┐       ┌──────────────────┐
│     users       │       │  refresh_tokens  │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │──────<│ user_id (FK)     │
│ username (UQ)   │       │ id (PK)          │
│ password        │       │ token_hash       │
│ email           │       │ expires_at       │
│ vip_level       │       │ is_revoked       │
│ is_admin        │       │ created_at       │
│ is_active       │       └──────────────────┘
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   categories    │       │     videos      │       │   video_tags    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──────<│ category_id(FK) │       │ video_id (PK,FK)│>─────┐
│ name            │       │ id (PK)         │──────<│ tag_id (PK,FK)  │>──┐  │
│ description     │       │ title           │       └─────────────────┘   │  │
│ sort_order      │       │ video_url       │                             │  │
│ is_active       │       │ duration        │       ┌─────────────────┐   │  │
└─────────────────┘       │ preview_duration│       │      tags       │   │  │
                          │ required_vip_lv │       ├─────────────────┤   │  │
┌─────────────────┐       │ view_count      │       │ id (PK)         │<──┘  │
│     images      │       │ is_active       │       │ name (UQ)       │      │
├─────────────────┤       └─────────────────┘<──────│                 │──────┘
│ id (PK)         │                                 └─────────────────┘
│ title           │
│ image_url       │
│ required_vip_lv │
│ is_active       │
└─────────────────┘
```

## VIP 等級

| 等級 | 名稱 | 說明 |
|------|------|------|
| 1 | 免費會員 | 預設等級 |
| 2 | 銅牌會員 | 基礎 VIP |
| 3 | 銀牌會員 | 進階 VIP |
| 4 | 金牌會員 | 高級 VIP |
| 5 | 白金會員 | 可觀看圖片 |
| 6 | 鑽石會員 | 最高等級 |
