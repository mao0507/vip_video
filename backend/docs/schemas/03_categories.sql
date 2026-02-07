-- ============================================
-- Table: categories (分類)
-- Description: 影片分類資料
-- ============================================

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- 主鍵
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);

-- ============================================
-- 欄位說明
-- ============================================
-- id            : UUID 主鍵，自動生成
-- name          : 分類名稱，最長 100 字元
-- description   : 分類描述，可為空
-- sort_order    : 排序順序，預設 0
-- is_active     : 是否啟用，預設 true
-- created_at    : 建立時間
-- updated_at    : 更新時間
-- ============================================
