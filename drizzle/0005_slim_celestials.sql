CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"contract_id" uuid,
	"zip_code" text NOT NULL,
	"address_line" text NOT NULL,
	"number" text NOT NULL,
	"complement" text,
	"district" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "professionals" RENAME COLUMN "specialty" TO "category";--> statement-breakpoint
ALTER TABLE "availabilities" ALTER COLUMN "start_hour" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "availabilities" ALTER COLUMN "end_hour" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "shift" varchar(20);--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "resume" text;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;