ALTER TABLE "addresses" RENAME COLUMN "user_id" TO "professional_id";--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;