-- ============================================
-- Table: refresh_tokens (刷新令牌)
-- Description: 儲存 JWT Refresh Token，用於實現 Token 刷新機制
-- ============================================

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    token_hash character varying NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- 主鍵
ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY (id);

-- 外鍵：關聯使用者，刪除使用者時連帶刪除 token
ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ============================================
-- 欄位說明
-- ============================================
-- id            : UUID 主鍵，自動生成
-- token_hash    : Token 的 SHA256 雜湊值
-- user_id       : 使用者 ID（外鍵）
-- expires_at    : Token 過期時間
-- is_revoked    : 是否已撤銷，預設 false
-- created_at    : 建立時間
-- ============================================
