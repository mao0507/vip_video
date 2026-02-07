-- ============================================
-- Table: video_tags (影片標籤關聯)
-- Description: 影片與標籤的多對多關聯表
-- ============================================

CREATE TABLE public.video_tags (
    video_id uuid NOT NULL,
    tag_id uuid NOT NULL
);

-- 複合主鍵
ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT "PK_2f81b8c0221388d4c33d7892a1f" PRIMARY KEY (video_id, tag_id);

-- 索引：加速 tag_id 查詢
CREATE INDEX "IDX_b2d90b3d034e87bde8dd51788d" ON public.video_tags USING btree (tag_id);

-- 索引：加速 video_id 查詢
CREATE INDEX "IDX_e27933328455988a734bf02575" ON public.video_tags USING btree (video_id);

-- 外鍵：關聯標籤
ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT "FK_b2d90b3d034e87bde8dd51788d3"
    FOREIGN KEY (tag_id) REFERENCES public.tags(id);

-- 外鍵：關聯影片，刪除影片時連帶刪除關聯
ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT "FK_e27933328455988a734bf025751"
    FOREIGN KEY (video_id) REFERENCES public.videos(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- ============================================
-- 欄位說明
-- ============================================
-- video_id      : 影片 ID（複合主鍵、外鍵）
-- tag_id        : 標籤 ID（複合主鍵、外鍵）
-- ============================================
