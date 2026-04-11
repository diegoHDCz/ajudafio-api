ALTER TABLE "addresses" RENAME COLUMN "professional_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_professional_id_professionals_id_fk";
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;