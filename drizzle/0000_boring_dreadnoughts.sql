CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"auth_id" text,
	"created_at" timestamp DEFAULT now(),
	"username" text,
	"role" text NOT NULL
);
