# VIP 會員平台資料庫 Schema

> 資料庫：PostgreSQL
> 資料庫名稱：`vip_platform`
> 更新日期：2026-02-08

---

## 目錄

- [ER Diagram](#er-diagram)
- [資料表列表](#資料表列表)
- [詳細 Schema](#詳細-schema)
  - [users - 使用者](#users---使用者)
  - [refresh_tokens - 刷新令牌](#refresh_tokens---刷新令牌)
  - [categories - 分類](#categories---分類)
  - [videos - 影片](#videos---影片)
  - [images - 圖片](#images---圖片)
  - [tags - 標籤](#tags---標籤)
  - [video_tags - 影片標籤關聯](#video_tags---影片標籤關聯)
- [VIP 等級說明](#vip-等級說明)

---

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
│ sort_order      │       │ description     │                             │  │
│ is_active       │       │ video_url       │       ┌─────────────────┐   │  │
│ created_at      │       │ thumbnail_url   │       │      tags       │   │  │
│ updated_at      │       │ duration        │       ├─────────────────┤   │  │
└─────────────────┘       │ preview_duration│       │ id (PK)         │<──┘  │
                          │ required_vip_lv │       │ name (UQ)       │      │
┌─────────────────┐       │ view_count      │       │ created_at      │      │
│     images      │       │ is_active       │       │ updated_at      │      │
├─────────────────┤       │ created_at      │       └─────────────────┘      │
│ id (PK)         │       │ updated_at      │                                │
│ title           │       └─────────────────┘<───────────────────────────────┘
│ description     │
│ image_url       │
│ thumbnail_url   │
│ required_vip_lv │
│ is_active       │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## 資料表列表

| 資料表 | 說明 | 主鍵 |
|--------|------|------|
| `users` | 使用者資料 | `id` (UUID) |
| `refresh_tokens` | JWT 刷新令牌 | `id` (UUID) |
| `categories` | 影片分類 | `id` (UUID) |
| `videos` | 影片資料 | `id` (UUID) |
| `images` | 圖片資料 | `id` (UUID) |
| `tags` | 標籤 | `id` (UUID) |
| `video_tags` | 影片與標籤的多對多關聯 | `video_id`, `tag_id` (複合主鍵) |

---

## 詳細 Schema

### users - 使用者

儲存系統使用者資料，包含 VIP 等級與管理員權限。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `id` | UUID | NOT NULL | `uuid_generate_v4()` | 主鍵 |
| `username` | VARCHAR(50) | NOT NULL | - | 使用者名稱（唯一） |
| `password` | VARCHAR | NOT NULL | - | 密碼（bcrypt 加密） |
| `email` | VARCHAR(100) | NULL | - | 電子郵件 |
| `vip_level` | INTEGER | NOT NULL | `1` | VIP 等級 (1-6) |
| `is_admin` | BOOLEAN | NOT NULL | `false` | 是否為管理員 |
| `is_active` | BOOLEAN | NOT NULL | `true` | 帳號是否啟用 |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | 建立時間 |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | 更新時間 |

**索引：**
- `PK_a3ffb1c0c8416b9fc6f907b7433` - PRIMARY KEY (`id`)
- `UQ_fe0bb3f6520ee0469504521e710` - UNIQUE (`username`)

**關聯：**
- 被 `refresh_tokens.user_id` 參照

---

### refresh_tokens - 刷新令牌

儲存 JWT Refresh Token，用於實現 Token 刷新機制。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `id` | UUID | NOT NULL | `uuid_generate_v4()` | 主鍵 |
| `token_hash` | VARCHAR | NOT NULL | - | Token SHA256 雜湊值 |
| `user_id` | UUID | NOT NULL | - | 使用者 ID（外鍵） |
| `expires_at` | TIMESTAMP | NOT NULL | - | 過期時間 |
| `is_revoked` | BOOLEAN | NOT NULL | `false` | 是否已撤銷 |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | 建立時間 |

**索引：**
- `PK_7d8bee0204106019488c4c50ffa` - PRIMARY KEY (`id`)

**外鍵：**
- `FK_3ddc983c5f7bcf132fd8732c3f4` - `user_id` → `users(id)` ON DELETE CASCADE

---

### categories - 分類

影片分類資料。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `id` | UUID | NOT NULL | `uuid_generate_v4()` | 主鍵 |
| `name` | VARCHAR(100) | NOT NULL | - | 分類名稱 |
| `description` | TEXT | NULL | - | 分類描述 |
| `sort_order` | INTEGER | NOT NULL | `0` | 排序順序 |
| `is_active` | BOOLEAN | NOT NULL | `true` | 是否啟用 |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | 建立時間 |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | 更新時間 |

**索引：**
- `PK_24dbc6126a28ff948da33e97d3b` - PRIMARY KEY (`id`)

**關聯：**
- 被 `videos.category_id` 參照

---

### videos - 影片

影片資料，包含 VIP 等級限制與試看時長設定。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `id` | UUID | NOT NULL | `uuid_generate_v4()` | 主鍵 |
| `title` | VARCHAR(200) | NOT NULL | - | 影片標題 |
| `description` | TEXT | NULL | - | 影片描述 |
| `video_url` | VARCHAR | NOT NULL | - | 影片網址 |
| `thumbnail_url` | VARCHAR | NULL | - | 縮圖網址 |
| `duration` | INTEGER | NOT NULL | `0` | 影片時長（秒） |
| `preview_duration` | INTEGER | NOT NULL | `60` | 試看時長（秒） |
| `required_vip_level` | INTEGER | NOT NULL | `1` | 需要的 VIP 等級 |
| `view_count` | INTEGER | NOT NULL | `0` | 觀看次數 |
| `category_id` | UUID | NULL | - | 分類 ID（外鍵） |
| `is_active` | BOOLEAN | NOT NULL | `true` | 是否啟用 |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | 建立時間 |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | 更新時間 |

**索引：**
- `PK_e4c86c0cf95aff16e9fb8220f6b` - PRIMARY KEY (`id`)

**外鍵：**
- `FK_f9fe0463a9fa4899f41ab736511` - `category_id` → `categories(id)` ON DELETE SET NULL

**關聯：**
- 被 `video_tags.video_id` 參照

---

### images - 圖片

圖片資料，預設需要 VIP 5 以上才能觀看。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `id` | UUID | NOT NULL | `uuid_generate_v4()` | 主鍵 |
| `title` | VARCHAR(200) | NOT NULL | - | 圖片標題 |
| `description` | TEXT | NULL | - | 圖片描述 |
| `image_url` | VARCHAR | NOT NULL | - | 圖片網址 |
| `thumbnail_url` | VARCHAR | NULL | - | 縮圖網址 |
| `required_vip_level` | INTEGER | NOT NULL | `5` | 需要的 VIP 等級 |
| `is_active` | BOOLEAN | NOT NULL | `true` | 是否啟用 |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | 建立時間 |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | 更新時間 |

**索引：**
- `PK_1fe148074c6a1a91b63cb9ee3c9` - PRIMARY KEY (`id`)

---

### tags - 標籤

影片標籤資料。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `id` | UUID | NOT NULL | `uuid_generate_v4()` | 主鍵 |
| `name` | VARCHAR(50) | NOT NULL | - | 標籤名稱（唯一） |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | 建立時間 |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | 更新時間 |

**索引：**
- `PK_e7dc17249a1148a1970748eda99` - PRIMARY KEY (`id`)
- `UQ_d90243459a697eadb8ad56e9092` - UNIQUE (`name`)

**關聯：**
- 被 `video_tags.tag_id` 參照

---

### video_tags - 影片標籤關聯

影片與標籤的多對多關聯表。

| 欄位 | 類型 | 允許空值 | 預設值 | 說明 |
|------|------|----------|--------|------|
| `video_id` | UUID | NOT NULL | - | 影片 ID（複合主鍵、外鍵） |
| `tag_id` | UUID | NOT NULL | - | 標籤 ID（複合主鍵、外鍵） |

**索引：**
- `PK_2f81b8c0221388d4c33d7892a1f` - PRIMARY KEY (`video_id`, `tag_id`)
- `IDX_e27933328455988a734bf02575` - INDEX (`video_id`)
- `IDX_b2d90b3d034e87bde8dd51788d` - INDEX (`tag_id`)

**外鍵：**
- `FK_e27933328455988a734bf025751` - `video_id` → `videos(id)` ON UPDATE CASCADE ON DELETE CASCADE
- `FK_b2d90b3d034e87bde8dd51788d3` - `tag_id` → `tags(id)`

---

## VIP 等級說明

| 等級 | 名稱 | 常數 | 說明 |
|------|------|------|------|
| 1 | 免費會員 | `VIP_LEVELS.FREE` | 預設等級，可試看影片 |
| 2 | 銅牌會員 | `VIP_LEVELS.BRONZE` | 基礎 VIP |
| 3 | 銀牌會員 | `VIP_LEVELS.SILVER` | 進階 VIP |
| 4 | 金牌會員 | `VIP_LEVELS.GOLD` | 高級 VIP |
| 5 | 白金會員 | `VIP_LEVELS.PLATINUM` | 尊榮 VIP，可觀看圖片 |
| 6 | 鑽石會員 | `VIP_LEVELS.DIAMOND` | 最高等級 |

---

## Docker 資料庫連線

```bash
# 容器名稱：vip-db
# 連線指令
docker exec -it vip-db psql -U postgres -d vip_platform

# 查看所有資料表
\dt

# 查看特定資料表結構
\d+ users
```

---

## 環境變數

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=vip_platform
```
