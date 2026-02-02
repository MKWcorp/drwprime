-- Migration: Add Team-Based Affiliate System
-- Date: 2025-02-02
-- Description: Remove unique constraint from affiliateCode and add isTeamLeader field

-- Step 1: Drop the unique constraint on affiliateCode
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_affiliateCode_key";

-- Step 2: Add isTeamLeader field (default false)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isTeamLeader" BOOLEAN NOT NULL DEFAULT false;

-- Step 3: Set existing users as team leaders (since they created their own codes)
UPDATE "users" SET "isTeamLeader" = true WHERE "isTeamLeader" = false;

-- Step 4: Create index on affiliateCode for better query performance (since it's no longer unique)
CREATE INDEX IF NOT EXISTS "users_affiliateCode_idx" ON "users"("affiliateCode");

-- Verification queries (run these to check):
-- SELECT "affiliateCode", COUNT(*) as "team_size", 
--        SUM(CASE WHEN "isTeamLeader" THEN 1 ELSE 0 END) as "leaders"
-- FROM "users" 
-- GROUP BY "affiliateCode"
-- ORDER BY "team_size" DESC;
