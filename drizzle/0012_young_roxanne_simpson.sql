CREATE TYPE "public"."day_of_week" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');--> statement-breakpoint
CREATE TYPE "public"."shift" AS ENUM('MORNING', 'AFTERNOON', 'NIGHT', 'FULL_DAY');--> statement-breakpoint
ALTER TABLE "availabilities" ALTER COLUMN "day_of_week" SET DATA TYPE "public"."day_of_week" USING "day_of_week"::"public"."day_of_week";--> statement-breakpoint
ALTER TABLE "availabilities" ALTER COLUMN "shift" SET DATA TYPE "public"."shift" USING "shift"::"public"."shift";