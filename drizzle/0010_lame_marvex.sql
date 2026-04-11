ALTER TABLE "users" ADD COLUMN "second_telephone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "second_telephone_whatsapp" boolean DEFAULT false NOT NULL;