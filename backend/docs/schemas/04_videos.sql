-- ============================================
-- Table: videos (影片)
-- Description: 影片資料，包含 VIP 等級限制與試看時長設定
-- ============================================

CREATE TABLE public.videos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    video_url character varying NOT NULL,
    thumbnail_url character varying,
    duration integer DEFAULT 0 NOT NULL,
    preview_duration integer DEFAULT 60 NOT NULL,
    required_vip_level integer DEFAULT 1 NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    category_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- 主鍵
ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY (id);

-- 外鍵：關聯分類，刪除分類時設為 NULL
ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "FK_f9fe0463a9fa4899f41ab736511"
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

-- ============================================
-- 欄位說明
-- ============================================
-- id                 : UUID 主鍵，自動生成
-- title              : 影片標題，最長 200 字元
-- description        : 影片描述，可為空
-- video_url          : 影片網址
-- thumbnail_url      : 縮圖網址，可為空
-- duration           : 影片時長（秒），預設 0
-- preview_duration   : 試看時長（秒），預設 60
-- required_vip_level : 需要的 VIP 等級，預設 1
-- view_count         : 觀看次數，預設 0
-- category_id        : 分類 ID（外鍵），可為空
-- is_active          : 是否啟用，預設 true
-- created_at         : 建立時間
-- updated_at         : 更新時間
-- ============================================
