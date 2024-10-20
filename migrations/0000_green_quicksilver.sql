DO $$ BEGIN
 CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('in progress', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasksTable" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"priority" "priority" NOT NULL,
	"status" "status" NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTable" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hash_password" text NOT NULL,
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasksTable" ADD CONSTRAINT "tasksTable_user_id_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
