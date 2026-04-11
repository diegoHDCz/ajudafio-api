ALTER TABLE "users" ADD COLUMN "telephone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "telephone_whatsapp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedin" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "instagram" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "facebook" text;