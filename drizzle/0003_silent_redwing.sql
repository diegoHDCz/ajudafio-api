CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"contract_id" uuid NOT NULL,
	"professional_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_details" (
	"id" uuid PRIMARY KEY NOT NULL,
	"contract_id" uuid NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"attends_at_home" boolean DEFAULT false NOT NULL,
	"attends_hospital" boolean DEFAULT false NOT NULL,
	"attends_nursing_home" boolean DEFAULT false NOT NULL,
	"scheduled_days" text[] DEFAULT '{}' NOT NULL,
	"start_hour" text NOT NULL,
	"end_hour" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_locations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"contract_id" uuid NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_schedules" (
	"id" uuid PRIMARY KEY NOT NULL,
	"contract_id" uuid NOT NULL,
	"day_of_week" text NOT NULL,
	"start_hour" text NOT NULL,
	"end_hour" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_services" (
	"id" uuid PRIMARY KEY NOT NULL,
	"contract_id" uuid NOT NULL,
	"service_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"professional_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"hour_rate" integer NOT NULL,
	"total_hours" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"shift" text NOT NULL,
	"discount_percentage" integer DEFAULT 0 NOT NULL,
	"minimum_hours_to_available_discount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_availabilities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"professional_id" uuid NOT NULL,
	"day_of_week" text NOT NULL,
	"start_hour" text NOT NULL,
	"end_hour" text NOT NULL,
	"shift" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_locations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"professional_id" uuid NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_services" (
	"id" uuid PRIMARY KEY NOT NULL,
	"professional_id" uuid NOT NULL,
	"service_type" text NOT NULL
);
