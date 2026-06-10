-- Migration: Add best deal monthly promos
-- Date: 2026-05-26
-- Description: Create best_deal_promos table for public Best Deal page and FO dashboard manager

CREATE TABLE IF NOT EXISTS "best_deal_promos" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT,
  "imageUrl" TEXT,
  "promoMonth" TEXT NOT NULL,
  "validFrom" TIMESTAMP(3),
  "validUntil" TIMESTAMP(3),
  "ctaText" TEXT DEFAULT 'Reservasi Sekarang',
  "ctaLink" TEXT,
  "terms" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "best_deal_promos_isActive_order_idx"
  ON "best_deal_promos"("isActive", "order");

CREATE INDEX IF NOT EXISTS "best_deal_promos_promoMonth_idx"
  ON "best_deal_promos"("promoMonth");
