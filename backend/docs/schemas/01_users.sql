-- ============================================
-- Table: users (使用者)
-- Description: 儲存系統使用者資料，包含 VIP 等級與管理員權限
-- ============================================

-- 需要先啟用 uuid-ossp 擴充
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 建立資料表
CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(50) NOT NULL,
    password character varying NOT NULL,
    email character varying(100),
    vip_level integer DEFAULT 1 NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- 主鍵
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);

-- 唯一索引：使用者名稱
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);

-- ============================================
-- 欄位說明
-- ============================================
-- id            : UUID 主鍵，自動生成
-- username      : 使用者名稱，最長 50 字元，唯一
-- password      : 密碼（bcrypt 加密）
-- email         : 電子郵件，最長 100 字元，可為空
-- vip_level     : VIP 等級 (1-6)，預設 1
-- is_admin      : 是否為管理員，預設 false
-- is_active     : 帳號是否啟用，預設 true
-- created_at    : 建立時間
-- updated_at    : 更新時間
-- ============================================
