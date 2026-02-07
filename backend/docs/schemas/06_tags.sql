-- ============================================
-- Table: tags (標籤)
-- Description: 影片標籤資料
-- ============================================

CREATE TABLE public.tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- 主鍵
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY (id);

-- 唯一索引：標籤名稱
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE (name);

-- ============================================
-- 欄位說明
-- ============================================
-- id            : UUID 主鍵，自動生成
-- name          : 標籤名稱，最長 50 字元，唯一
-- created_at    : 建立時間
-- updated_at    : 更新時間
-- ============================================
