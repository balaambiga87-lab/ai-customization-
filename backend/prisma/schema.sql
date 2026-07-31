-- ==========================================
-- CARATLINE PRODUCTION POSTGRESQL SCHEMA DDL
-- ==========================================

-- 1. Create Enums
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'DESIGNER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'MANUFACTURING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED');

-- 2. Create Tables

-- USERS Table
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- REFRESH TOKENS Table
CREATE TABLE "refresh_tokens" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "token" VARCHAR(500) UNIQUE NOT NULL,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES Table
CREATE TABLE "categories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "slug" VARCHAR(100) UNIQUE NOT NULL,
    "description" TEXT,
    "parent_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- PRODUCTS Table
CREATE TABLE "products" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL REFERENCES "categories"("id"),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "sku" VARCHAR(100) UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "base_price" DECIMAL(10, 2) NOT NULL,
    "is_customizable" BOOLEAN NOT NULL DEFAULT TRUE,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "chk_products_base_price" CHECK ("base_price" >= 0)
);

-- PRODUCT IMAGES Table
CREATE TABLE "product_images" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT FALSE,
    "sort_order" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- MATERIALS Table
CREATE TABLE "materials" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(100) UNIQUE NOT NULL,
    "material_type" VARCHAR(50) NOT NULL,
    "purity" VARCHAR(20) NOT NULL,
    "price_per_gram" DECIMAL(10, 2) NOT NULL,
    "density" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_materials_price" CHECK ("price_per_gram" >= 0),
    CONSTRAINT "chk_materials_density" CHECK ("density" > 0)
);

-- GEMSTONES Table
CREATE TABLE "gemstones" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(100) UNIQUE NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "shape" VARCHAR(50) NOT NULL,
    "carat" DECIMAL(5, 2) NOT NULL,
    "color" VARCHAR(30),
    "clarity" VARCHAR(30),
    "cut" VARCHAR(30),
    "price" DECIMAL(10, 2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_gemstones_price" CHECK ("price" >= 0),
    CONSTRAINT "chk_gemstones_carat" CHECK ("carat" > 0)
);

-- ASSET CATEGORIES Table
CREATE TABLE "asset_categories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- JEWELLERY ASSETS Table
CREATE TABLE "jewellery_assets" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "asset_category_id" UUID NOT NULL REFERENCES "asset_categories"("id"),
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(100) UNIQUE NOT NULL,
    "model_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "price_modifier" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

-- BLUEPRINTS Table
CREATE TABLE "blueprints" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id" UUID REFERENCES "products"("id") ON DELETE SET NULL,
    "name" VARCHAR(255) NOT NULL,
    "model_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "base_price" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "chk_blueprints_price" CHECK ("base_price" >= 0)
);

-- BLUEPRINT ANCHORS Table
CREATE TABLE "blueprint_anchors" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "blueprint_id" UUID NOT NULL REFERENCES "blueprints"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "anchor_type" VARCHAR(50) NOT NULL,
    "position_x" DOUBLE PRECISION NOT NULL,
    "position_y" DOUBLE PRECISION NOT NULL,
    "position_z" DOUBLE PRECISION NOT NULL,
    "rotation_x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rotation_y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rotation_z" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scale_x" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "scale_y" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "scale_z" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "allowed_asset_category_ids" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SAVED DESIGNS Table
CREATE TABLE "saved_designs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "blueprint_id" UUID NOT NULL REFERENCES "blueprints"("id"),
    "name" VARCHAR(255) NOT NULL,
    "configuration" JSONB NOT NULL,
    "total_price" DECIMAL(10, 2) NOT NULL,
    "preview_url" VARCHAR(500),
    "is_public" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "chk_saved_designs_price" CHECK ("total_price" >= 0)
);

-- DESIGN OBJECTS Table
CREATE TABLE "design_objects" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "saved_design_id" UUID NOT NULL REFERENCES "saved_designs"("id") ON DELETE CASCADE,
    "blueprint_anchor_id" UUID NOT NULL REFERENCES "blueprint_anchors"("id") ON DELETE CASCADE,
    "jewellery_asset_id" UUID REFERENCES "jewellery_assets"("id") ON DELETE SET NULL,
    "material_id" UUID REFERENCES "materials"("id") ON DELETE SET NULL,
    "gemstone_id" UUID REFERENCES "gemstones"("id") ON DELETE SET NULL,
    "custom_text" VARCHAR(255),
    "scale_factor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "price_calculated" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_design_objects_scale" CHECK ("scale_factor" > 0)
);

-- PROMPT HISTORY Table
CREATE TABLE "prompt_histories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "prompt_text" TEXT NOT NULL,
    "enhanced_prompt_text" TEXT,
    "negative_prompt_text" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI GENERATED PREVIEWS Table
CREATE TABLE "ai_generated_previews" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prompt_history_id" UUID NOT NULL REFERENCES "prompt_histories"("id") ON DELETE CASCADE,
    "image_url" VARCHAR(500) NOT NULL,
    "depth_map_url" VARCHAR(500),
    "is_saved" BOOLEAN NOT NULL DEFAULT FALSE,
    "saved_design_id" UUID REFERENCES "saved_designs"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI RECOMMENDATIONS Table
CREATE TABLE "ai_recommendations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "recommender_type" VARCHAR(100) NOT NULL,
    "blueprint_id" UUID REFERENCES "blueprints"("id") ON DELETE SET NULL,
    "product_id" UUID REFERENCES "products"("id") ON DELETE SET NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "ai_selected_assets" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_ai_recs_score" CHECK ("confidence_score" >= 0.0 AND "confidence_score" <= 1.0)
);

-- CARTS Table
CREATE TABLE "carts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "session_id" VARCHAR(255) UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CART ITEMS Table
CREATE TABLE "cart_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "cart_id" UUID NOT NULL REFERENCES "carts"("id") ON DELETE CASCADE,
    "product_id" UUID REFERENCES "products"("id") ON DELETE SET NULL,
    "saved_design_id" UUID REFERENCES "saved_designs"("id") ON DELETE CASCADE,
    "quantity" INT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_cart_items_quantity" CHECK ("quantity" > 0),
    CONSTRAINT "chk_item_reference" CHECK ("product_id" IS NOT NULL OR "saved_design_id" IS NOT NULL)
);

-- ORDERS Table
CREATE TABLE "orders" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "order_number" VARCHAR(100) UNIQUE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(10, 2) NOT NULL,
    "tax_amount" DECIMAL(10, 2) NOT NULL,
    "shipping_amount" DECIMAL(10, 2) NOT NULL,
    "shipping_address" JSONB NOT NULL,
    "billing_address" JSONB NOT NULL,
    "tracking_number" VARCHAR(100),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "chk_orders_total" CHECK ("total_amount" >= 0),
    CONSTRAINT "chk_orders_tax" CHECK ("tax_amount" >= 0),
    CONSTRAINT "chk_orders_shipping" CHECK ("shipping_amount" >= 0)
);

-- ORDER ITEMS Table
CREATE TABLE "order_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
    "product_id" UUID REFERENCES "products"("id") ON DELETE SET NULL,
    "saved_design_id" UUID REFERENCES "saved_designs"("id") ON DELETE SET NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "quantity" INT NOT NULL DEFAULT 1,
    "configuration_snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_order_items_price" CHECK ("price" >= 0),
    CONSTRAINT "chk_order_items_qty" CHECK ("quantity" > 0),
    CONSTRAINT "chk_order_item_reference" CHECK ("product_id" IS NOT NULL OR "saved_design_id" IS NOT NULL)
);

-- PAYMENTS Table
CREATE TABLE "payments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
    "payment_method" VARCHAR(50) NOT NULL,
    "transaction_id" VARCHAR(255) UNIQUE NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_details" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_payments_amount" CHECK ("amount" > 0)
);

-- REVIEWS Table
CREATE TABLE "reviews" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "product_id" UUID REFERENCES "products"("id") ON DELETE CASCADE,
    "saved_design_id" UUID REFERENCES "saved_designs"("id") ON DELETE CASCADE,
    "rating" INT NOT NULL,
    "title" VARCHAR(255),
    "comment" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chk_reviews_rating" CHECK ("rating" >= 1 AND "rating" <= 5),
    CONSTRAINT "chk_review_target" CHECK ("product_id" IS NOT NULL OR "saved_design_id" IS NOT NULL)
);

-- AUDIT LOGS Table
CREATE TABLE "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_name" VARCHAR(100),
    "entity_id" UUID,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Specific Database Performance Indexes

-- Authentication Indexes
CREATE INDEX "idx_refresh_tokens_token" ON "refresh_tokens"("token");
CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens"("user_id");

-- Catalog Indexes
CREATE INDEX "idx_categories_parent" ON "categories"("parent_id");
CREATE INDEX "idx_products_category" ON "products"("category_id");
CREATE INDEX "idx_products_slug" ON "products"("slug");
CREATE INDEX "idx_products_sku" ON "products"("sku");
CREATE INDEX "idx_product_images_product" ON "product_images"("product_id");
CREATE INDEX "idx_materials_sku" ON "materials"("sku");
CREATE INDEX "idx_gemstones_sku" ON "gemstones"("sku");

-- Customization Indexes
CREATE INDEX "idx_jewellery_assets_cat" ON "jewellery_assets"("asset_category_id");
CREATE INDEX "idx_jewellery_assets_sku" ON "jewellery_assets"("sku");
CREATE INDEX "idx_blueprints_product" ON "blueprints"("product_id");
CREATE INDEX "idx_blueprint_anchors_bp" ON "blueprint_anchors"("blueprint_id");
CREATE INDEX "idx_saved_designs_user" ON "saved_designs"("user_id");
CREATE INDEX "idx_saved_designs_bp" ON "saved_designs"("blueprint_id");

-- GIN Index for JSONB Search on configurations
CREATE INDEX "idx_saved_designs_config_gin" ON "saved_designs" USING GIN ("configuration");

-- Design Objects compound lookups
CREATE INDEX "idx_design_objects_sd" ON "design_objects"("saved_design_id");
CREATE INDEX "idx_design_objects_anchor" ON "design_objects"("blueprint_anchor_id");

-- AI Indexes
CREATE INDEX "idx_prompt_histories_user" ON "prompt_histories"("user_id");
CREATE INDEX "idx_ai_gen_previews_prompt" ON "ai_generated_previews"("prompt_history_id");
CREATE INDEX "idx_ai_gen_previews_sd" ON "ai_generated_previews"("saved_design_id");
CREATE INDEX "idx_ai_recs_user" ON "ai_recommendations"("user_id");

-- Commerce Indexes
CREATE INDEX "idx_carts_user" ON "carts"("user_id");
CREATE INDEX "idx_cart_items_cart" ON "cart_items"("cart_id");
CREATE INDEX "idx_orders_user" ON "orders"("user_id");
CREATE INDEX "idx_orders_number" ON "orders"("order_number");
CREATE INDEX "idx_order_items_order" ON "order_items"("order_id");
CREATE INDEX "idx_payments_order" ON "payments"("order_id");
CREATE INDEX "idx_payments_txn" ON "payments"("transaction_id");

-- Review and Audit Indexes
CREATE INDEX "idx_reviews_user" ON "reviews"("user_id");
CREATE INDEX "idx_reviews_prod" ON "reviews"("product_id");
CREATE INDEX "idx_reviews_sd" ON "reviews"("saved_design_id");
CREATE INDEX "idx_audit_logs_user" ON "audit_logs"("user_id");
CREATE INDEX "idx_audit_logs_action" ON "audit_logs"("action");
