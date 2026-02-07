-- ============================================
-- VIP 會員平台資料庫初始化腳本
-- Database: vip_platform
-- ============================================

-- 啟用 UUID 擴充
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. users (使用者)
-- ============================================
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

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);

-- ============================================
-- 2. refresh_tokens (刷新令牌)
-- ============================================
CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    token_hash character varying NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ============================================
-- 3. categories (分類)
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

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);

-- ============================================
-- 4. videos (影片)
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

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY (id);

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "FK_f9fe0463a9fa4899f41ab736511"
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

-- ============================================
-- 5. images (圖片)
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

ALTER TABLE ONLY public.images
    ADD CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY (id);

-- ============================================
-- 6. tags (標籤)
-- ============================================
CREATE TABLE public.tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY (id);

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE (name);

-- ============================================
-- 7. video_tags (影片標籤關聯)
-- ============================================
CREATE TABLE public.video_tags (
    video_id uuid NOT NULL,
    tag_id uuid NOT NULL
);

ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT "PK_2f81b8c0221388d4c33d7892a1f" PRIMARY KEY (video_id, tag_id);

CREATE INDEX "IDX_b2d90b3d034e87bde8dd51788d" ON public.video_tags USING btree (tag_id);
CREATE INDEX "IDX_e27933328455988a734bf02575" ON public.video_tags USING btree (video_id);

ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT "FK_b2d90b3d034e87bde8dd51788d3"
    FOREIGN KEY (tag_id) REFERENCES public.tags(id);

ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT "FK_e27933328455988a734bf025751"
    FOREIGN KEY (video_id) REFERENCES public.videos(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- ============================================
-- 初始化完成
-- ============================================
