# VIP 會員平台開發任務清單

## 技術棧
- **前端**: Vue3 + TypeScript + Vite + Element Plus
- **後端**: NestJS + TypeScript
- **資料庫**: PostgreSQL
- **認證**: JWT

---

## 階段一：專案初始化與環境建置

### 任務 1.1：建立 NestJS 後端專案架構

- [ ] 使用 Nest CLI 建立新專案
  ```bash
  npm i -g @nestjs/cli
  nest new backend-api
  ```
- [ ] 選擇包管理器（建議 pnpm 或 yarn）
- [ ] 調整 `tsconfig.json` 設定
  - 啟用 `strict` 模式
  - 設定 `paths` 別名（@/src/*）
- [ ] 建立專案資料夾結構
  ```
  src/
  ├── common/              # 共用模組
  │   ├── decorators/      # 自定義裝飾器
  │   ├── filters/         # 例外過濾器
  │   ├── guards/          # 守衛
  │   ├── interceptors/    # 攔截器
  │   ├── pipes/           # 管道
  │   └── utils/           # 工具函式
  ├── config/              # 配置檔案
  │   ├── database.config.ts
  │   ├── jwt.config.ts
  │   └── app.config.ts
  ├── modules/             # 功能模組
  │   ├── auth/           
  │   ├── users/          
  │   ├── videos/         
  │   ├── images/         
  │   ├── tags/           
  │   └── categories/     
  ├── entities/            # 資料庫實體
  ├── dto/                 # 資料傳輸對象
  ├── main.ts             
  └── app.module.ts       
  ```
- [ ] 安裝必要依賴套件
  ```bash
  pnpm add @nestjs/config @nestjs/typeorm typeorm pg
  pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt
  pnpm add bcrypt class-validator class-transformer
  pnpm add @nestjs/throttler helmet
  pnpm add -D @types/passport-jwt @types/bcrypt
  ```

---

### 任務 1.2：建立 Vue3 + TypeScript 前端專案

- [ ] 使用 Vite 建立 Vue3 + TypeScript 專案
  ```bash
  npm create vite@latest frontend -- --template vue-ts
  cd frontend
  pnpm install
  ```
- [ ] 安裝核心依賴
  ```bash
  pnpm add vue-router@4 pinia axios
  pnpm add element-plus @element-plus/icons-vue
  pnpm add @vueuse/core dayjs
  pnpm add -D unplugin-vue-components unplugin-auto-import
  ```
- [ ] 配置 `vite.config.ts`
  - 設定路徑別名 `@` 指向 `src`
  - 配置 Element Plus 自動導入
  - 設定開發伺服器 proxy（代理後端 API）
- [ ] 建立專案資料夾結構
  ```
  src/
  ├── api/                  # API 請求模組
  │   ├── axios.ts         # Axios 實例配置
  │   ├── auth.api.ts      # 認證相關 API
  │   ├── user.api.ts      # 使用者相關 API
  │   ├── video.api.ts     # 影片相關 API
  │   ├── image.api.ts     # 圖片相關 API
  │   ├── tag.api.ts       # 標籤相關 API
  │   └── category.api.ts  # 分類相關 API
  ├── assets/              # 靜態資源
  ├── components/          # 共用元件
  ├── composables/         # 組合式函式
  ├── layouts/             # 版面配置
  ├── router/              # 路由設定
  ├── stores/              # Pinia stores
  ├── types/               # TypeScript 型別定義
  ├── utils/               # 工具函式
  └── views/               # 頁面元件
  ```

---

### 任務 1.3：設定程式碼規範

- [ ] 安裝 ESLint 與 Prettier（前後端）
  ```bash
  pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-vue
  pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```
- [ ] 建立 `.eslintrc.js` 配置
- [ ] 建立 `.prettierrc` 配置
- [ ] 配置 Husky + lint-staged（提交前自動檢查）
  ```bash
  pnpm add -D husky lint-staged
  npx husky install
  npx husky add .husky/pre-commit "npx lint-staged"
  ```
- [ ] 在 `package.json` 新增 lint-staged 配置

---

### 任務 1.4：建立 Git Repository

- [ ] 初始化 Git 倉庫
- [ ] 建立 `.gitignore`（前後端）
- [ ] 建立遠端倉庫（GitHub/GitLab）
- [ ] 設定分支策略
  - `main`：正式環境
  - `develop`：開發環境
  - `feature/*`：功能開發分支
- [ ] 進行首次提交

---

### 任務 1.5：設定環境變數

**後端 `.env` 配置：**
- [ ] 建立 `.env` 檔案
  ```env
  # Application
  NODE_ENV=development
  PORT=3000
  API_PREFIX=api/v1
  
  # Database
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=your_password
  DB_DATABASE=vip_platform
  
  # JWT
  JWT_SECRET=your_super_secret_key_here
  JWT_EXPIRES_IN=7d
  JWT_REFRESH_SECRET=your_refresh_secret_key
  JWT_REFRESH_EXPIRES_IN=30d
  
  # CORS
  CORS_ORIGIN=http://localhost:5173
  
  # Rate Limiting
  THROTTLE_TTL=60
  THROTTLE_LIMIT=10
  ```
- [ ] 建立 `.env.example` 作為範本
- [ ] 確保 `.env` 已加入 `.gitignore`

**前端 `.env` 配置：**
- [ ] 建立 `.env.development`
- [ ] 建立 `.env.production`

---

## 階段二：資料庫設計與建置

### 任務 2.1：PostgreSQL 資料庫安裝與設定

- [ ] 安裝 PostgreSQL 14+ 版本
  - macOS: `brew install postgresql@14`
  - Linux: `sudo apt-get install postgresql-14`
  - Windows: 下載官方安裝程式
- [ ] 啟動 PostgreSQL 服務
- [ ] 建立資料庫
  ```sql
  CREATE DATABASE vip_platform;
  CREATE USER vip_admin WITH ENCRYPTED PASSWORD 'your_password';
  GRANT ALL PRIVILEGES ON DATABASE vip_platform TO vip_admin;
  ```
- [ ] 測試連線

---

### 任務 2.2：設計資料庫 Schema

**Users 表（使用者）：**
- [ ] 設計 `users` 表結構
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    vip_level INTEGER NOT NULL DEFAULT 1 CHECK (vip_level BETWEEN 1 AND 6),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
  );
  
  CREATE INDEX idx_users_username ON users(username);
  CREATE INDEX idx_users_vip_level ON users(vip_level);
  ```

**Videos 表（影片）：**
- [ ] 設計 `videos` 表結構
  ```sql
  CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    embed_code TEXT NOT NULL,
    embed_type VARCHAR(20) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER,
    view_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX idx_videos_title ON videos(title);
  CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
  ```

**Images 表（圖片資訊）：**
- [ ] 設計 `images` 表結構
  ```sql
  CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX idx_images_title ON images(title);
  CREATE INDEX idx_images_created_at ON images(created_at DESC);
  ```

**Tags 表（標籤）：**
- [ ] 設計 `tags` 表結構
  ```sql
  CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX idx_tags_name ON tags(name);
  CREATE INDEX idx_tags_slug ON tags(slug);
  ```

**Categories 表（分類）：**
- [ ] 設計 `categories` 表結構
  ```sql
  CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX idx_categories_name ON categories(name);
  CREATE INDEX idx_categories_slug ON categories(slug);
  ```

**Video_Tags 關聯表（影片-標籤 多對多）：**
- [ ] 設計 `video_tags` 表結構
  ```sql
  CREATE TABLE video_tags (
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, tag_id)
  );
  ```

**Video_Categories 關聯表（影片-分類 多對多）：**
- [ ] 設計 `video_categories` 表結構

**Image_Tags 關聯表（圖片-標籤 多對多）：**
- [ ] 設計 `image_tags` 表結構

**Image_Categories 關聯表（圖片-分類 多對多）：**
- [ ] 設計 `image_categories` 表結構

**Refresh_Tokens 表（刷新令牌）：**
- [ ] 設計 `refresh_tokens` 表結構
  ```sql
  CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

---

### 任務 2.3：設定 TypeORM

- [ ] 在 NestJS 安裝 TypeORM
- [ ] 在 `app.module.ts` 配置 TypeORM
- [ ] 設定資料庫連線參數

---

### 任務 2.4：建立 Entity 實體類別

- [ ] 建立 User Entity (`src/entities/user.entity.ts`)
- [ ] 建立 Video Entity (`src/entities/video.entity.ts`)
- [ ] 建立 Image Entity (`src/entities/image.entity.ts`)
- [ ] 建立 Tag Entity (`src/entities/tag.entity.ts`)
- [ ] 建立 Category Entity (`src/entities/category.entity.ts`)
- [ ] 建立 RefreshToken Entity (`src/entities/refresh-token.entity.ts`)

---

### 任務 2.5：建立資料庫遷移（Migration）

- [ ] 配置 TypeORM CLI
- [ ] 建立 `ormconfig.ts`
- [ ] 在 `package.json` 新增 migration 指令
- [ ] 生成初始 migration
- [ ] 執行 migration
- [ ] 建立種子資料（Seed Data）
  - 建立預設管理員帳號

---

## 階段三：後端 API 開發 (NestJS)

### 任務 3.1：認證模組開發

**設定 JWT 策略：**
- [ ] 安裝必要套件
- [ ] 建立 `src/modules/auth/auth.module.ts`
- [ ] 建立 JWT 策略 `src/modules/auth/strategies/jwt.strategy.ts`
- [ ] 建立 DTO `src/modules/auth/dto/login.dto.ts`
- [ ] 建立 Auth Service `src/modules/auth/auth.service.ts`
  - 實作 `login()` 方法
  - 實作 `logout()` 方法
  - 實作 `refreshAccessToken()` 方法
  - 實作 JWT Token 生成邏輯
- [ ] 建立 Auth Controller `src/modules/auth/auth.controller.ts`
  - POST `/auth/login` - 登入
  - POST `/auth/logout` - 登出
  - POST `/auth/refresh` - 刷新 Token
- [ ] 建立 JWT Guard `src/common/guards/jwt-auth.guard.ts`
- [ ] 建立 Public 裝飾器 `src/common/decorators/public.decorator.ts`

---

### 任務 3.2：VIP 等級權限 Guard

- [ ] 建立 VIP Level Guard `src/common/guards/vip-level.guard.ts`
  - 檢查用戶 VIP 等級
  - 根據需求等級判斷權限
- [ ] 建立 VipLevel 裝飾器 `src/common/decorators/vip-level.decorator.ts`
- [ ] 建立 Admin Guard `src/common/guards/admin.guard.ts`
  - 檢查是否為管理員

---

### 任務 3.3：使用者管理模組

- [ ] 建立 Users Module
  ```bash
  nest g module modules/users
  nest g service modules/users
  nest g controller modules/users
  ```
- [ ] 建立 DTO
  - `create-user.dto.ts` - 新增使用者
  - `update-user.dto.ts` - 更新使用者
  - `update-vip-level.dto.ts` - 更新 VIP 等級
- [ ] 實作 Users Service
  - `findAll()` - 取得使用者列表（支援分頁、搜尋）
  - `findOne()` - 取得單一使用者
  - `create()` - 新增使用者（密碼加密）
  - `update()` - 更新使用者資訊
  - `updateVipLevel()` - 更新 VIP 等級
  - `remove()` - 刪除使用者
  - `sanitizeUser()` - 移除敏感資訊（密碼）
- [ ] 實作 Users Controller
  - GET `/users` - 取得使用者列表
  - GET `/users/:id` - 取得單一使用者
  - POST `/users` - 新增使用者
  - PATCH `/users/:id` - 更新使用者
  - PATCH `/users/:id/vip-level` - 更新 VIP 等級
  - DELETE `/users/:id` - 刪除使用者
- [ ] 套用 JWT Guard 和 Admin Guard

---

### 任務 3.4：影片管理模組

- [ ] 建立 Videos Module
  ```bash
  nest g module modules/videos
  nest g service modules/videos
  nest g controller modules/videos
  ```
- [ ] 建立 DTO
  - `create-video.dto.ts` - 新增影片
  - `update-video.dto.ts` - 更新影片
- [ ] 實作 Videos Service
  - `findAll()` - 取得影片列表
    - 支援分頁
    - 支援關鍵字搜尋（標題、描述）
    - 支援標籤篩選
    - 支援分類篩選
    - 根據用戶 VIP 等級過濾資訊
  - `findOne()` - 取得單一影片
    - 增加觀看次數
    - 根據用戶 VIP 等級返回權限資訊
  - `create()` - 新增影片（關聯標籤、分類）
  - `update()` - 更新影片
  - `remove()` - 軟刪除影片
  - `processVideoByVipLevel()` - 處理 VIP 權限
    - VIP 1-2: previewOnly = true, previewDuration = 10
    - VIP 3-4: canWatch = true
- [ ] 實作 Videos Controller
  - GET `/videos` - 取得影片列表
  - GET `/videos/:id` - 取得單一影片
  - POST `/videos` - 新增影片（需要管理員）
  - PATCH `/videos/:id` - 更新影片（需要管理員）
  - DELETE `/videos/:id` - 刪除影片（需要管理員）

---

### 任務 3.5：圖片資訊管理模組

- [ ] 建立 Images Module
  ```bash
  nest g module modules/images
  nest g service modules/images
  nest g controller modules/images
  ```
- [ ] 建立 DTO
  - `create-image.dto.ts` - 新增圖片
  - `update-image.dto.ts` - 更新圖片
- [ ] 實作 Images Service
  - `findAll()` - 取得圖片列表
    - **檢查 VIP 等級 >= 5**
    - 支援分頁
    - 支援關鍵字搜尋
    - 支援標籤篩選
    - 支援分類篩選
  - `findOne()` - 取得單一圖片
    - **檢查 VIP 等級 >= 5**
  - `create()` - 新增圖片
  - `update()` - 更新圖片
  - `remove()` - 軟刪除圖片
- [ ] 實作 Images Controller
  - GET `/images` - 取得圖片列表（需要 VIP 5+）
  - GET `/images/:id` - 取得單一圖片（需要 VIP 5+）
  - POST `/images` - 新增圖片（需要管理員）
  - PATCH `/images/:id` - 更新圖片（需要管理員）
  - DELETE `/images/:id` - 刪除圖片（需要管理員）
- [ ] 套用 VipLevelGuard (@VipLevel(5))

---

### 任務 3.6：標籤管理模組

- [ ] 建立 Tags Module
  ```bash
  nest g module modules/tags
  nest g service modules/tags
  nest g controller modules/tags
  ```
- [ ] 建立 DTO
  - `create-tag.dto.ts` - 新增標籤
- [ ] 實作 Tags Service
  - `findAll()` - 取得所有標籤
  - `findOne()` - 取得單一標籤
  - `create()` - 新增標籤（自動生成 slug）
  - `remove()` - 刪除標籤
- [ ] 實作 Tags Controller
  - GET `/tags` - 取得標籤列表
  - GET `/tags/:id` - 取得單一標籤
  - POST `/tags` - 新增標籤（需要管理員）
  - DELETE `/tags/:id` - 刪除標籤（需要管理員）
- [ ] 使用 slugify 套件自動生成 slug

---

### 任務 3.7：分類管理模組

- [ ] 建立 Categories Module
  ```bash
  nest g module modules/categories
  nest g service modules/categories
  nest g controller modules/categories
  ```
- [ ] 建立 DTO
  - `create-category.dto.ts` - 新增分類（支援父分類）
- [ ] 實作 Categories Service
  - `findAll()` - 取得所有分類（支援階層式）
  - `findOne()` - 取得單一分類
  - `create()` - 新增分類（支援父子關係）
  - `update()` - 更新分類
  - `remove()` - 刪除分類
  - `getChildren()` - 取得子分類
- [ ] 實作 Categories Controller
  - GET `/categories` - 取得分類列表
  - GET `/categories/:id` - 取得單一分類
  - GET `/categories/:id/children` - 取得子分類
  - POST `/categories` - 新增分類（需要管理員）
  - PATCH `/categories/:id` - 更新分類（需要管理員）
  - DELETE `/categories/:id` - 刪除分類（需要管理員）

---

### 任務 3.8：搜尋功能模組

- [ ] 建立 Search Module
- [ ] 建立統一搜尋 API
  - GET `/search?keyword=xxx&type=video|image`
  - 支援標籤、標題搜尋
  - 根據用戶 VIP 等級過濾結果
  - 支援搜尋結果排序（相關度、時間）
- [ ] 實作 Search Service
  - `searchVideos()` - 搜尋影片
  - `searchImages()` - 搜尋圖片（VIP 5+）
  - `searchAll()` - 全站搜尋

---

### 任務 3.9：全域配置

**CORS 設定：**
- [ ] 在 `main.ts` 啟用 CORS
- [ ] 設定允許的來源 (CORS_ORIGIN)
- [ ] 啟用憑證支援

**Rate Limiting：**
- [ ] 安裝 `@nestjs/throttler`
- [ ] 在 `app.module.ts` 配置
  - TTL: 60 秒
  - Limit: 10 次請求

**Helmet Security：**
- [ ] 安裝並啟用 helmet
- [ ] 設定安全性 Headers

**全域配置：**
- [ ] 設定全域 API 前綴 (`api/v1`)
- [ ] 啟用 ValidationPipe（全域驗證）
  - whitelist: true
  - forbidNonWhitelisted: true
  - transform: true

**Swagger API 文件：**
- [ ] 安裝 `@nestjs/swagger`
- [ ] 在 `main.ts` 配置 Swagger
  - 標題: VIP Platform API
  - 版本: 1.0
  - 新增 Bearer Auth
- [ ] 訪問路徑: `/api/docs`

**全域錯誤處理：**
- [ ] 建立 HTTP Exception Filter
  - 統一錯誤回應格式
  - 記錄錯誤日誌
- [ ] 在 `main.ts` 註冊全域 Filter

---

## 階段四：前端開發 (Vue3 + TypeScript)

### 任務 4.1：設定 Axios 與 API 請求封裝

- [ ] 建立 Axios 實例 `src/api/axios.ts`
  - 設定 baseURL
  - 設定 timeout (15 秒)
  - 設定預設 headers
- [ ] 實作請求攔截器
  - 自動附加 JWT Token
  - 從 authStore 取得 accessToken
- [ ] 實作響應攔截器
  - 處理 401 錯誤（Token 過期）
    - 自動刷新 Token
    - 重新發送原請求
    - 失敗則登出並導向登入頁
  - 處理 403 錯誤（權限不足）
  - 處理 404 錯誤（資源不存在）
  - 處理 500 錯誤（伺服器錯誤）
  - 統一錯誤提示（使用 ElMessage）

---

### 任務 4.2：建立 TypeScript 型別定義

- [ ] 建立用戶型別 `src/types/user.d.ts`
  - User 介面
  - CreateUserDto 介面
  - UpdateUserDto 介面
  - UpdateVipLevelDto 介面
- [ ] 建立影片型別 `src/types/video.d.ts`
  - Video 介面
  - EmbedType 列舉
  - CreateVideoDto 介面
  - UpdateVideoDto 介面
  - VideoListParams 介面
  - VideoPermissions 介面
- [ ] 建立圖片型別 `src/types/image.d.ts`
  - Image 介面
  - CreateImageDto 介面
  - UpdateImageDto 介面
  - ImageListParams 介面
- [ ] 建立標籤型別 `src/types/tag.d.ts`
  - Tag 介面
  - CreateTagDto 介面
- [ ] 建立分類型別 `src/types/category.d.ts`
  - Category 介面（支援階層）
  - CreateCategoryDto 介面
- [ ] 建立通用型別 `src/types/api.d.ts`
  - ApiResponse<T> 介面
  - PaginatedResponse<T> 介面
  - LoginResponse 介面
  - LoginDto 介面
- [ ] 建立列舉 `src/types/enums.ts`
  - VipLevel 列舉 (1-6)
  - VipLevelLabels 對應表
  - VipLevelOptions 選項陣列

---

### 任務 4.3：建立 API 請求模組

- [ ] 建立認證 API `src/api/auth.api.ts`
  - `login()` - 登入
  - `logout()` - 登出
  - `refresh()` - 刷新 Token
- [ ] 建立使用者 API `src/api/user.api.ts`
  - `getUsers()` - 取得使用者列表
  - `getUser()` - 取得單一使用者
  - `createUser()` - 新增使用者
  - `updateUser()` - 更新使用者
  - `updateVipLevel()` - 更新 VIP 等級
  - `deleteUser()` - 刪除使用者
- [ ] 建立影片 API `src/api/video.api.ts`
  - `getVideos()` - 取得影片列表
  - `getVideo()` - 取得單一影片
  - `createVideo()` - 新增影片
  - `updateVideo()` - 更新影片
  - `deleteVideo()` - 刪除影片
- [ ] 建立圖片 API `src/api/image.api.ts`
  - `getImages()` - 取得圖片列表
  - `getImage()` - 取得單一圖片
  - `createImage()` - 新增圖片
  - `updateImage()` - 更新圖片
  - `deleteImage()` - 刪除圖片
- [ ] 建立標籤 API `src/api/tag.api.ts`
  - `getTags()` - 取得標籤列表
  - `getTag()` - 取得單一標籤
  - `createTag()` - 新增標籤
  - `deleteTag()` - 刪除標籤
- [ ] 建立分類 API `src/api/category.api.ts`
  - `getCategories()` - 取得分類列表
  - `getCategory()` - 取得單一分類
  - `createCategory()` - 新增分類
  - `deleteCategory()` - 刪除分類

---

### 任務 4.4：建立 Pinia Stores

- [ ] 建立認證 Store `src/stores/auth.ts`
  - State
    - accessToken (存於 localStorage)
    - refreshToken (存於 localStorage)
    - user (當前使用者資訊)
  - Getters
    - isAuthenticated (是否已登入)
    - isAdmin (是否為管理員)
    - vipLevel (VIP 等級)
  - Actions
    - `login()` - 登入並儲存 Token
    - `logout()` - 登出並清除資料
    - `refreshAccessToken()` - 刷新 Token
- [ ] 建立使用者 Store `src/stores/user.ts`
  - State
    - users (使用者列表)
    - currentUser (當前查看的使用者)
    - pagination (分頁資訊)
    - loading (載入狀態)
  - Actions
    - `fetchUsers()` - 取得使用者列表
    - `fetchUser()` - 取得單一使用者
    - `createUser()` - 新增使用者
    - `updateUser()` - 更新使用者
    - `updateVipLevel()` - 更新 VIP 等級
    - `deleteUser()` - 刪除使用者
- [ ] 建立影片 Store `src/stores/video.ts`
  - State
    - videos (影片列表)
    - currentVideo (當前播放的影片)
    - pagination (分頁資訊)
    - loading (載入狀態)
  - Actions
    - `fetchVideos()` - 取得影片列表
    - `fetchVideo()` - 取得單一影片
    - `createVideo()` - 新增影片
    - `updateVideo()` - 更新影片
    - `deleteVideo()` - 刪除影片
- [ ] 建立圖片 Store `src/stores/image.ts`（結構類似 video store）
- [ ] 建立標籤 Store `src/stores/tag.ts`
  - State
    - tags (標籤列表)
  - Actions
    - `fetchTags()` - 取得標籤列表
    - `createTag()` - 新增標籤
    - `deleteTag()` - 刪除標籤
- [ ] 建立分類 Store `src/stores/category.ts`
  - State
    - categories (分類列表)
  - Actions
    - `fetchCategories()` - 取得分類列表
    - `createCategory()` - 新增分類
    - `deleteCategory()` - 刪除分類

---

### 任務 4.5：建立 Composables（組合式函式）

- [ ] 建立權限判斷 Composable `src/composables/usePermission.ts`
  - `canWatchFullVideo` - 是否可觀看完整影片 (VIP 3+)
  - `canOnlyPreview` - 是否只能試看 (VIP 1-2)
  - `canAccessImages` - 是否可存取圖片 (VIP 5+)
  - `isAdmin` - 是否為管理員
  - `hasVipLevel(level)` - 檢查特定 VIP 等級
- [ ] 建立影片播放器 Composable `src/composables/useVideoPlayer.ts`
  - State
    - currentTime (當前播放時間)
    - isPreviewEnded (試看是否結束)
  - Methods
    - `startPreviewTimer()` - 開始 10 秒計時
    - `showPreviewEndDialog()` - 顯示權限不足彈窗
    - `clearPreviewTimer()` - 清除計時器
  - 功能
    - 監聽播放時間
    - 10 秒後暫停並彈窗（VIP 1-2）
    - 完整播放（VIP 3+）
- [ ] 建立分頁 Composable `src/composables/usePagination.ts`
  - State
    - page (當前頁數)
    - limit (每頁筆數)
    - total (總筆數)
    - totalPages (總頁數)
  - Methods
    - `setPage()` - 設定頁數
    - `setLimit()` - 設定每頁筆數
    - `setTotal()` - 設定總筆數
    - `nextPage()` - 下一頁
    - `prevPage()` - 上一頁
    - `reset()` - 重置
- [ ] 建立搜尋 Composable `src/composables/useSearch.ts`
  - State
    - keyword (搜尋關鍵字)
    - isSearching (搜尋中)
  - Methods
    - `handleSearch()` - 處理搜尋（含防抖）
    - `clearSearch()` - 清除搜尋
  - 使用 useDebounceFn (500ms)

---

### 任務 4.6：建立路由配置

- [ ] 設定 Vue Router `src/router/index.ts`
  - 定義路由結構
    - `/` - 重導向至 `/login`
    - `/login` - 登入頁
    - `/admin` - 管理員後台（需要管理員權限）
      - `/admin/users` - 使用者管理
      - `/admin/videos` - 影片管理
      - `/admin/videos/create` - 新增影片
      - `/admin/videos/:id/edit` - 編輯影片
      - `/admin/images` - 圖片管理
      - `/admin/images/create` - 新增圖片
      - `/admin/images/:id/edit` - 編輯圖片
      - `/admin/tags` - 標籤管理
      - `/admin/categories` - 分類管理
    - `/member` - 會員專區（需要登入）
      - `/member/videos` - 影片列表
      - `/member/videos/:id` - 影片詳情
      - `/member/images` - 圖片資訊（需要 VIP 5+）
- [ ] 實作路由守衛 `router.beforeEach()`
  - 檢查是否需要登入 (requiresAuth)
  - 檢查是否需要管理員權限 (requiresAdmin)
  - 檢查 VIP 等級 (requiresVipLevel)
  - 已登入用戶訪問登入頁自動導向
    - 管理員 → `/admin`
    - 會員 → `/member`
  - 未登入訪問需要認證的頁面 → `/login`
  - 非管理員訪問管理員頁面 → `/member`
  - VIP 等級不足 → 提示並導向
- [ ] 設定路由 meta 資訊
  - requiresAuth
  - requiresAdmin
  - requiresVipLevel

---

### 任務 4.7：建立 Layout 版面

- [ ] 建立管理員 Layout `src/layouts/AdminLayout.vue`
  - 側邊選單（Sidebar）
    - Logo 區域
    - 導航選單
      - 使用者管理
      - 影片管理
      - 圖片管理
      - 標籤管理
      - 分類管理
  - 頂部 Header
    - 左側：歡迎訊息
    - 右側：登出按鈕
  - Main 內容區
    - `<router-view>` 插槽
  - 樣式
    - 使用 Element Plus Container 組件
    - 深色側邊欄 (#001529)
    - 固定高度 100vh
- [ ] 建立會員 Layout `src/layouts/MemberLayout.vue`
  - 頂部 Header
    - 左側：Logo 和標題
    - 中間：水平導航選單
      - 影片專區
      - 圖片資訊（VIP 5+ 才可點擊）
    - 右側：VIP 等級標籤、登出按鈕
  - Main 內容區
    - `<router-view>` 插槽
  - 樣式
    - 水平導航 (mode="horizontal")
    - VIP 等級標籤醒目顯示
    - 不足權限的選單項目顯示鎖定標示

---

### 任務 4.8：建立登入頁面

- [ ] 建立登入頁面 `src/views/auth/Login.vue`
  - 頁面結構
    - 置中登入卡片
    - 標題：VIP 會員平台
    - 登入表單
  - 表單欄位
    - 用戶名（必填）
    - 密碼（必填，最少 6 個字符）
  - 表單驗證
    - 使用 Element Plus Form validation
    - 即時驗證
  - 登入按鈕
    - 提交表單
    - 載入中狀態
  - 功能實作
    - 呼叫 authStore.login()
    - 成功後根據身份導向
      - 管理員 → `/admin`
      - 會員 → `/member`
    - 失敗顯示錯誤訊息
  - 樣式
    - 背景漸層或圖片
    - 卡片陰影效果
    - RWD 響應式設計

---

### 任務 4.9：建立後台管理頁面

#### **使用者管理頁面**

- [ ] 建立使用者列表 `src/views/admin/users/UserList.vue`
  - 頂部工具列
    - 左側：標題「使用者管理」
    - 右側：新增使用者按鈕
  - 搜尋區域
    - 搜尋框（用戶名、電話）
    - 即時搜尋（防抖 500ms）
  - 使用者表格
    - 欄位：用戶名、電話、VIP 等級、狀態、建立時間、操作
    - VIP 等級下拉選單（可直接修改）
    - 操作按鈕：編輯、刪除
  - 分頁元件
    - 顯示總筆數
    - 每頁 10 筆
    - 頁碼切換
  - 新增/編輯使用者對話框
    - 表單欄位：用戶名、密碼、電話、VIP 等級
    - 表單驗證
    - 確認/取消按鈕
  - 刪除確認對話框
    - 二次確認
    - 顯示使用者名稱
  - 功能實作
    - 載入使用者列表
    - 搜尋使用者
    - 新增使用者
    - 更新 VIP 等級
    - 刪除使用者
    - 成功/失敗提示

#### **影片管理頁面**

- [ ] 建立影片列表 `src/views/admin/videos/VideoList.vue`
  - 頂部工具列
    - 左側：標題「影片管理」
    - 右側：新增影片按鈕
  - 篩選區域
    - 搜尋框（標題、描述）
    - 標籤篩選（多選）
    - 分類篩選（多選）
    - 重置按鈕
  - 影片列表（卡片式或表格式）
    - 縮圖
    - 標題
    - 嵌入類型（YouTube/Vimeo/Google Drive）
    - 觀看次數
    - 標籤
    - 分類
    - 建立時間
    - 操作：編輯、刪除
  - 分頁元件
  - 功能實作
    - 載入影片列表
    - 搜尋和篩選
    - 刪除影片
    - 導向新增/編輯頁面

- [ ] 建立影片表單 `src/views/admin/videos/VideoForm.vue`
  - 用於新增和編輯影片
  - 表單欄位
    - 標題（必填）
    - 描述
    - 嵌入代碼（必填）
    - 嵌入類型（下拉選單：YouTube/Vimeo/Google Drive）
    - 縮圖 URL
    - 影片時長（秒）
    - 標籤（多選，可新增）
    - 分類（多選）
  - 表單驗證
    - 必填欄位檢查
    - URL 格式驗證
  - 預覽區域
    - 即時預覽嵌入影片
  - 按鈕
    - 儲存、取消
  - 功能實作
    - 新增模式：呼叫 createVideo()
    - 編輯模式：載入影片資料、呼叫 updateVideo()
    - 成功後返回列表頁

#### **圖片管理頁面**

- [ ] 建立圖片列表 `src/views/admin/images/ImageList.vue`
  - 頂部工具列
    - 左側：標題「圖片資訊管理」
    - 右側：新增圖片按鈕
  - 篩選區域
    - 搜尋框
    - 標籤篩選
    - 分類篩選
  - 圖片網格（卡片式）
    - 圖片預覽
    - 標題
    - 連結 URL
    - 標籤
    - 操作：編輯、刪除
  - 分頁元件
  - 功能實作
    - 載入圖片列表
    - 搜尋和篩選
    - 刪除圖片
    - 導向新增/編輯頁面

- [ ] 建立圖片表單 `src/views/admin/images/ImageForm.vue`
  - 表單欄位
    - 標題（必填）
    - 描述
    - 圖片 URL（必填）
    - 連結 URL
    - 標籤（多選）
    - 分類（多選）
  - 圖片預覽
    - 即時顯示圖片
  - 按鈕
    - 儲存、取消
  - 功能實作
    - 新增/編輯圖片
    - 表單驗證
    - 成功後返回列表頁

#### **標籤管理頁面**

- [ ] 建立標籤列表 `src/views/admin/tags/TagList.vue`
  - 頂部工具列
    - 左側：標題「標籤管理」
    - 右側：新增標籤按鈕
  - 標籤表格
    - 欄位：名稱、Slug、建立時間、操作
    - 操作：刪除
  - 新增標籤對話框
    - 表單欄位：標籤名稱
    - 自動生成 Slug（後端處理）
  - 功能實作
    - 載入標籤列表
    - 新增標籤
    - 刪除標籤

#### **分類管理頁面**

- [ ] 建立分類列表 `src/views/admin/categories/CategoryList.vue`
  - 頂部工具列
    - 左側：標題「分類管理」
    - 右側：新增分類按鈕
  - 分類樹狀表格
    - 顯示階層結構
    - 欄位：名稱、Slug、描述、操作
    - 支援展開/收合子分類
  - 新增分類對話框
    - 表單欄位：名稱、描述、父分類（下拉選單）
  - 功能實作
    - 載入分類列表（階層式）
    - 新增分類
    - 刪除分類

---

### 任務 4.10：建立前台會員頁面

#### **影片列表頁面**

- [ ] 建立影片列表 `src/views/member/videos/VideoList.vue`
  - 頂部區域
    - 頁面標題「影片專區」
    - 搜尋框
  - 篩選側邊欄（或頂部）
    - 標籤篩選（多選 Checkbox）
    - 分類篩選（多選 Checkbox）
    - 清除篩選按鈕
  - 影片網格（卡片式）
    - 每個卡片包含
      - 影片縮圖
      - 標題
      - 簡短描述
      - 觀看次數
      - 標籤（Tag 標籤）
      - VIP 權限標示
        - VIP 1-2: 顯示「試看 10 秒」標籤
        - VIP 3+: 顯示「完整觀看」標籤
    - 點擊卡片導向詳情頁
  - 分頁元件
  - 功能實作
    - 載入影片列表
    - 搜尋影片
    - 標籤和分類篩選
    - 根據用戶 VIP 等級顯示權限標示

#### **影片詳情/播放頁面**

- [ ] 建立影片詳情 `src/views/member/videos/VideoDetail.vue`
  - 影片播放區
    - 嵌入式播放器
      - 使用 iframe 或 video 標籤
      - 根據 embedType 顯示對應播放器
    - **VIP 1-2 權限控制**
      - 使用 useVideoPlayer composable
      - 開始播放時啟動 10 秒計時器
      - 10 秒後：
        - 暫停影片
        - 顯示遮罩層（覆蓋播放器）
        - 彈出對話框：「您的 VIP 等級僅能試看前 10 秒，如需觀看完整影片，請聯繫客服升級會員等級」
        - 對話框不可關閉（closeOnClickModal: false）
    - **VIP 3+ 完整觀看**
      - 無時間限制
      - 正常播放
  - 影片資訊區
    - 標題
    - 觀看次數
    - 建立時間
    - 標籤（可點擊篩選同標籤影片）
    - 分類（可點擊篩選同分類影片）
    - 詳細描述
  - 功能實作
    - 載入影片詳情
    - 根據 VIP 等級控制播放權限
    - 實作 10 秒試看機制
    - 增加觀看次數

#### **圖片資訊頁面（VIP 5+ 限定）**

- [ ] 建立圖片列表 `src/views/member/images/ImageList.vue`
  - 權限檢查
    - 頁面載入前檢查 VIP 等級
    - VIP < 5: 顯示權限不足提示
  - 頂部區域
    - 頁面標題「圖片資訊」
    - VIP 等級標示（VIP 5+）
    - 搜尋框
  - 篩選區域
    - 標籤篩選
    - 分類篩選
  - 圖片網格（瀑布流或卡片式）
    - 每個卡片包含
      - 圖片預覽
      - 標題
      - 簡短描述
      - 標籤
      - **VIP 5-6 可點擊**
        - 點擊圖片：開啟原圖或跳轉連結
      - **VIP < 5 點擊攔截**
        - 點擊時彈出提示：「需要 VIP 5 或以上等級」
        - 不執行跳轉
  - 分頁元件
  - 功能實作
    - 載入圖片列表（僅 VIP 5+）
    - 搜尋和篩選
    - 點擊圖片權限控制
    - 開啟連結（新視窗）

---

### 任務 4.11：建立共用元件

- [ ] Loading 載入元件 `src/components/common/AppLoading.vue`
  - 全屏載入遮罩
  - 使用 Element Plus Loading
  - 可自定義文字

- [ ] 彈窗元件 `src/components/common/AppModal.vue`
  - 可重用的對話框元件
  - Props: title, visible, width
  - Slots: default (內容), footer (按鈕區)
  - Events: confirm, cancel

- [ ] 確認對話框元件 `src/components/common/ConfirmDialog.vue`
  - 二次確認對話框
  - Props: message, type (warning/danger)
  - Events: confirm, cancel

- [ ] 分頁元件 `src/components/common/AppPagination.vue`
  - Props: total, page, limit
  - Events: change, update:page, update:limit
  - 顯示總筆數、總頁數
  - 頁碼切換
  - 每頁筆數選擇

- [ ] 標籤選擇器元件 `src/components/common/TagSelector.vue`
  - 多選標籤
  - 支援搜尋
  - 支援新增標籤
  - Props: modelValue (v-model)
  - Events: update:modelValue

- [ ] 分類選擇器元件 `src/components/common/CategorySelector.vue`
  - 多選分類
  - 支援階層顯示
  - Props: modelValue (v-model)
  - Events: update:modelValue

- [ ] 權限不足提示元件 `src/components/common/PermissionDenied.vue`
  - 顯示權限不足訊息
  - Props: requiredLevel (需要的 VIP 等級)
  - 顯示升級提示

- [ ] 搜尋框元件 `src/components/common/SearchBox.vue`
  - 帶防抖的搜尋框
  - Props: placeholder, delay
  - Events: search

- [ ] 影片卡片元件 `src/components/video/VideoCard.vue`
  - 顯示影片縮圖、標題、資訊
  - Props: video
  - 顯示 VIP 權限標籤
  - 點擊導向詳情頁

- [ ] 影片播放器元件 `src/components/video/VideoPlayer.vue`
  - 根據 embedType 顯示播放器
  - 整合 useVideoPlayer
  - 實作 10 秒試看機制
  - Props: video, canWatch, previewOnly
  - Events: timeupdate, ended

- [ ] 影片篩選器元件 `src/components/video/VideoFilter.vue`
  - 標籤篩選
  - 分類篩選
  - Props: tags, categories, selectedTags, selectedCategories
  - Events: update:selectedTags, update:selectedCategories, clear

- [ ] 圖片卡片元件 `src/components/image/ImageCard.vue`
  - 顯示圖片、標題、資訊
  - Props: image, canAccess
  - 點擊權限控制
  - Events: click

- [ ] 圖片篩選器元件 `src/components/image/ImageFilter.vue`
  - 標籤篩選
  - 分類篩選
  - Props: tags, categories, selectedTags, selectedCategories
  - Events: update:selectedTags, update:selectedCategories, clear

---

### 任務 4.12：樣式與主題設定

- [ ] 建立全域樣式 `src/assets/styles/main.scss`
  - 重置樣式
  - 全域變數（顏色、字體、間距）
  - 通用工具類別 (utilities)

- [ ] 建立變數檔 `src/assets/styles/variables.scss`
  - 主題色彩
  - VIP 等級顏色
  - 字體大小
  - 斷點 (breakpoints)

- [ ] 建立 Mixins `src/assets/styles/mixins.scss`
  - 響應式斷點 mixin
  - Flexbox 佈局 mixin
  - 卡片陰影 mixin

- [ ] 自定義 Element Plus 主題
  - 修改主色調
  - 調整組件樣式

---

## 階段五：整合與測試

### 任務 5.1：前後端整合

- [ ] 串接所有 API
  - 測試每個 API 端點
  - 確認請求和響應格式正確
- [ ] 處理 API 錯誤回應
  - 統一錯誤處理
  - 友善的錯誤訊息
- [ ] 實作 Loading 狀態
  - 每個請求顯示載入中
  - 避免重複提交
- [ ] 測試各項功能流程
  - 登入/登出流程
  - CRUD 操作流程
  - 權限控制流程

---

### 任務 5.2：功能測試

**後端測試：**
- [ ] 撰寫單元測試（NestJS）
  - Service 層測試
  - Controller 層測試
  - 使用 Jest
- [ ] 測試 API 端點
  - 使用 Postman 或 Insomnia
  - 測試各種請求參數
  - 測試錯誤情況

**前端測試：**
- [ ] 元件單元測試（Vitest）
  - 測試共用元件
  - 測試 Composables
- [ ] E2E 測試（Playwright 或 Cypress）
  - 測試使用者流程
  - 測試關鍵功能路徑

**權限控制測試：**
- [ ] VIP 1-2 影片 10 秒限制測試
  - 驗證計時器正確啟動
  - 驗證 10 秒後彈窗
  - 驗證遮罩層正確顯示
- [ ] VIP 3-4 完整影片觀看測試
  - 驗證無時間限制
  - 驗證可正常播放
- [ ] VIP 5-6 圖片存取測試
  - 驗證可點擊圖片
  - 驗證可開啟連結
- [ ] VIP < 5 圖片攔截測試
  - 驗證點擊被攔截
  - 驗證提示訊息顯示
- [ ] 管理員權限測試
  - 驗證僅管理員可存取後台
  - 驗證會員無法存取後台

**跨瀏覽器測試：**
- [ ] Chrome 測試
- [ ] Firefox 測試
- [ ] Safari 測試
- [ ] Edge 測試
- [ ] 行動裝置測試（iOS Safari、Chrome Mobile）

---

### 任務 5.3：效能優化

**前端優化：**
- [ ] 程式碼分割（Code Splitting）
  - 路由層級懶載入
  - 元件懶載入
- [ ] 圖片優化
  - 圖片延遲載入（Lazy Loading）
  - 使用 WebP 格式
  - 壓縮圖片大小
- [ ] 前端快取
  - API 回應快取（適當的資料）
  - 使用 localStorage 快取靜態資料
- [ ] 打包優化
  - 分析打包大小（vite-bundle-visualizer）
  - 移除未使用的程式碼
  - 壓縮 JS/CSS

**後端優化：**
- [ ] 資料庫查詢優化
  - 新增必要的索引
  - 優化複雜查詢
  - 避免 N+1 查詢問題
- [ ] API 回應快取
  - 使用 Redis 快取常用資料
  - 設定適當的快取時間
- [ ] 分頁優化
  - 使用游標分頁（Cursor Pagination）
  - 限制每頁最大筆數

---

## 階段六：部署與上線

### 任務 6.1：部署準備

- [ ] 準備正式環境伺服器
  - 選擇雲端服務商（AWS、GCP、Azure、Linode）
  - 設定伺服器規格
  - 安裝作業系統（Ubuntu 22.04 LTS）

- [ ] 安裝必要軟體
  - Node.js 18+
  - PostgreSQL 14+
  - Nginx
  - PM2（Node.js 進程管理）

- [ ] 設定 SSL 憑證
  - 使用 Let's Encrypt 免費憑證
  - 安裝 Certbot
  - 設定自動續期

- [ ] 設定 Nginx 反向代理
  - 配置後端 API 代理
  - 配置前端靜態檔案服務
  - 設定 HTTPS 重導向
  - 設定 Gzip 壓縮

- [ ] 設定防火牆
  - 開放必要 Port（80、443、SSH）
  - 關閉不必要的 Port

- [ ] 建立 Docker 容器化（選用）
  - 撰寫 Dockerfile（前後端）
  - 撰寫 docker-compose.yml
  - 設定環境變數

- [ ] 設定 CI/CD 流程（選用）
  - 使用 GitHub Actions 或 GitLab CI
  - 自動測試
  - 自動部署

---

### 任務 6.2：資料庫部署

- [ ] 在正式環境安裝 PostgreSQL
- [ ] 建立正式資料庫
- [ ] 設定資料庫存取權限
- [ ] 執行 Migration
- [ ] 建立種子資料（預設管理員）
- [ ] 設定資料庫備份機制
  - 每日自動備份
  - 備份到異地儲存

---

### 任務 6.3：後端部署

- [ ] 上傳後端程式碼到伺服器
- [ ] 安裝依賴套件
  ```bash
  pnpm install --production
  ```
- [ ] 設定正式環境變數
  - 資料庫連線資訊
  - JWT Secret
  - CORS 設定
- [ ] 編譯 TypeScript
  ```bash
  pnpm build
  ```
- [ ] 使用 PM2 啟動應用
  ```bash
  pm2 start dist/main.js --name backend-api
  pm2 save
  pm2 startup
  ```
- [ ] 測試 API 是否正常運作
- [ ] 設定 PM2 日誌
- [ ] 設定錯誤通知

---

### 任務 6.4：前端部署

- [ ] 設定正式環境變數
  - API Base URL
- [ ] 編譯前端程式碼
  ```bash
  pnpm build
  ```
- [ ] 上傳 dist 資料夾到伺服器
- [ ] 設定 Nginx 指向 dist 資料夾
- [ ] 設定 SPA 路由重寫規則
  ```nginx
  try_files $uri $uri/ /index.html;
  ```
- [ ] 測試前端是否正常運作
- [ ] 測試所有路由
- [ ] 測試 API 串接

---

### 任務 6.5：上線檢查

- [ ] 功能測試
  - 登入/登出
  - 使用者管理
  - 影片管理
  - 圖片管理
  - 權限控制
- [ ] 效能測試
  - 頁面載入速度
  - API 回應時間
- [ ] 安全性檢查
  - SSL 憑證有效
  - HTTPS 強制重導向
  - API 權限正確
  - 無 SQL Injection 漏洞
  - 無 XSS 漏洞
- [ ] 壓力測試
  - 使用 Apache Bench 或 Artillery
  - 測試並發請求
- [ ] SEO 優化（如果需要）
  - Meta Tags
  - Open Graph
- [ ] 監控設定
  - 設定伺服器監控（CPU、記憶體、硬碟）
  - 設定應用監控（錯誤率、回應時間）
  - 設定日誌收集

---

### 任務 6.6：文件撰寫

- [ ] 撰寫 README.md
  - 專案簡介
  - 技術棧
  - 安裝步驟
  - 開發指南
- [ ] 撰寫 API 文件
  - 使用 Swagger 自動生成
  - 補充說明
- [ ] 撰寫使用者操作手冊
  - 管理員操作指南
  - 會員使用指南
- [ ] 撰寫部署文件
  - 環境需求
  - 部署步驟
  - 常見問題

---

## 階段七：維護與優化

### 任務 7.1：監控與日誌

- [ ] 設定錯誤追蹤
  - 使用 Sentry 或類似服務
  - 追蹤前後端錯誤
- [ ] 設定效能監控
  - 監控 API 回應時間
  - 監控頁面載入速度
- [ ] 設定日誌系統
  - 集中式日誌管理
  - 日誌等級分類
  - 日誌保留政策

---

### 任務 7.2：使用者回饋與優化

- [ ] 收集使用者回饋
  - 建立回饋機制
  - 定期檢視回饋
- [ ] 分析使用者行為
  - 追蹤常用功能
  - 分析使用瓶頸
- [ ] 持續優化
  - 修復 Bug
  - 優化使用體驗
  - 新增需求功能

---

### 任務 7.3：安全性更新

- [ ] 定期更新依賴套件
  - 檢查安全性漏洞
  - 更新到最新穩定版本
- [ ] 定期檢查安全性
  - 進行滲透測試
  - 檢查 OWASP Top 10
- [ ] 備份與災難復原
  - 定期測試備份還原
  - 制定災難復原計畫

---

## 開發時程建議

### 第一週：環境建置與資料庫
- 任務 1.1 - 1.5：專案初始化
- 任務 2.1 - 2.5：資料庫設計與建置

### 第二週：後端核心功能
- 任務 3.1 - 3.3：認證與使用者管理
- 任務 3.4：影片管理模組

### 第三週：後端進階功能
- 任務 3.5：圖片管理模組
- 任務 3.6 - 3.9：標籤、分類、搜尋、全域配置

### 第四週：前端基礎建置
- 任務 4.1 - 4.7：API 封裝、Stores、路由、Layout
- 任務 4.8：登入頁面

### 第五週：後台管理介面
- 任務 4.9：所有後台管理頁面

### 第六週：前台會員介面
- 任務 4.10：所有前台會員頁面
- 任務 4.11：共用元件開發

### 第七週：測試與優化
- 任務 5.1 - 5.3：整合測試與效能優化
- 任務 4.12：樣式調整

### 第八週：部署上線
- 任務 6.1 - 6.6：部署與文件撰寫

---

## 核心功能檢查清單

### 認證與授權
- [ ] JWT 認證機制
- [ ] 登入/登出功能
- [ ] Token 刷新機制
- [ ] 管理員權限檢查
- [ ] VIP 等級權限檢查

### 使用者管理
- [ ] 手動新增使用者
- [ ] 編輯使用者資訊
- [ ] 更新 VIP 等級
- [ ] 刪除使用者
- [ ] 使用者列表（分頁、搜尋）

### 影片管理
- [ ] 影片 CRUD
- [ ] 影片嵌入（YouTube/Vimeo/Google Drive）
- [ ] 標籤與分類關聯
- [ ] 搜尋與篩選
- [ ] VIP 1-2：試看 10 秒機制
- [ ] VIP 3-4：完整觀看
- [ ] 觀看次數統計

### 圖片資訊管理
- [ ] 圖片 CRUD
- [ ] 標籤與分類關聯
- [ ] 搜尋與篩選
- [ ] VIP 5-6：可存取
- [ ] VIP < 5：點擊攔截

### 標籤與分類
- [ ] 標籤 CRUD
- [ ] 分類 CRUD（支援階層）
- [ ] 自動生成 Slug

### 前台功能
- [ ] 登入介面
- [ ] 影片瀏覽（卡片式）
- [ ] 影片播放（含權限控制）
- [ ] 圖片瀏覽（VIP 5+）
- [ ] 搜尋與篩選

### 後台功能
- [ ] 使用者管理介面
- [ ] 影片管理介面
- [ ] 圖片管理介面
- [ ] 標籤管理介面
- [ ] 分類管理介面

---

## 注意事項

1. **安全性**
   - 所有密碼必須加密（bcrypt）
   - 使用 HTTPS
   - 實作 Rate Limiting
   - 防止 SQL Injection
   - 防止 XSS 攻擊

2. **效能**
   - 資料庫查詢優化
   - 前端程式碼分割
   - 圖片延遲載入

3. **使用者體驗**
   - 友善的錯誤訊息
   - 載入狀態提示
   - 響應式設計
   - 直覺的操作介面

4. **可維護性**
   - 程式碼註解
   - 統一的程式碼風格
   - 模組化設計
   - 完整的文件

---

## 開發工具建議

- **IDE**: VS Code
- **版本控制**: Git + GitHub/GitLab
- **API 測試**: Postman 或 Insomnia
- **資料庫管理**: DBeaver 或 pgAdmin
- **設計稿**: Figma（如需要）
- **專案管理**: Trello、Notion 或 GitHub Projects

---

**最後更新日期**: 2025-02-07