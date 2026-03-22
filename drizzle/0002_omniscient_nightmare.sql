ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "license_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "specialty" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "years_of_experience" integer;