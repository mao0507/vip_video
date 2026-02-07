-- ============================================
-- Table: images (圖片)
-- Description: 圖片資料，預設需要 VIP 5 以上才能觀看
-- ============================================

CREATE TABLE public.images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    image_url character varying NOT NULL,
    thumbnail_url character varying,
    required_vip_level integer DEFAULT 5 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- 主鍵
ALTER TABLE ONLY public.images
    ADD CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY (id);

-- ============================================
-- 欄位說明
-- ============================================
-- id                 : UUID 主鍵，自動生成
-- title              : 圖片標題，最長 200 字元
-- description        : 圖片描述，可為空
-- image_url          : 圖片網址
-- thumbnail_url      : 縮圖網址，可為空
-- required_vip_level : 需要的 VIP 等級，預設 5
-- is_active          : 是否啟用，預設 true
-- created_at         : 建立時間
-- updated_at         : 更新時間
-- ============================================
