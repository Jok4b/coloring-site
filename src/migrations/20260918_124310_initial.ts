import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_coloring_pages_difficulty" AS ENUM('easy', 'medium', 'detailed');
  CREATE TYPE "public"."enum_coloring_pages_audience" AS ENUM('kids', 'adults', 'all');
  CREATE TYPE "public"."enum_coloring_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__coloring_pages_v_version_difficulty" AS ENUM('easy', 'medium', 'detailed');
  CREATE TYPE "public"."enum__coloring_pages_v_version_audience" AS ENUM('kids', 'adults', 'all');
  CREATE TYPE "public"."enum__coloring_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_names_gender" AS ENUM('F', 'M');
  CREATE TYPE "public"."enum_name_templates_letter_case" AS ENUM('upper', 'normal');
  CREATE TABLE "coloring_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"category_id" integer,
  	"difficulty" "enum_coloring_pages_difficulty" DEFAULT 'easy',
  	"audience" "enum_coloring_pages_audience" DEFAULT 'kids',
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_coloring_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "coloring_pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_coloring_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_image_id" integer,
  	"version_description" varchar,
  	"version_category_id" integer,
  	"version_difficulty" "enum__coloring_pages_v_version_difficulty" DEFAULT 'easy',
  	"version_audience" "enum__coloring_pages_v_version_audience" DEFAULT 'kids',
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__coloring_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_coloring_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"intro" varchar,
  	"order" numeric DEFAULT 10,
  	"show_on_home" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "names" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"gender" "enum_names_gender",
  	"rank" numeric,
  	"births" numeric,
  	"year" numeric,
  	"about" varchar,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "name_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"box_x" numeric DEFAULT 50 NOT NULL,
  	"box_y" numeric DEFAULT 50 NOT NULL,
  	"box_width" numeric DEFAULT 80 NOT NULL,
  	"box_height" numeric DEFAULT 25 NOT NULL,
  	"letter_case" "enum_name_templates_letter_case" DEFAULT 'upper',
  	"order" numeric DEFAULT 10,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "name_imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"per_gender" numeric DEFAULT 250 NOT NULL,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "search_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"query" varchar NOT NULL,
  	"count" numeric DEFAULT 1,
  	"last_searched_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"coloring_pages_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"names_id" integer,
  	"name_templates_id" integer,
  	"name_imports_id" integer,
  	"search_logs_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Coloring Pages' NOT NULL,
  	"hero_title" varchar DEFAULT 'What do you want to color?',
  	"hero_text" varchar DEFAULT 'Free coloring pages you can print in one click, or color right here on your phone, tablet or computer.',
  	"home_description" varchar DEFAULT 'Free printable coloring pages for kids and adults. Print in one click, download a PDF, or color online.',
  	"footer_text" varchar DEFAULT 'Free to print for home and classroom use.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "coloring_pages" ADD CONSTRAINT "coloring_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coloring_pages" ADD CONSTRAINT "coloring_pages_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coloring_pages_texts" ADD CONSTRAINT "coloring_pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coloring_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_coloring_pages_v" ADD CONSTRAINT "_coloring_pages_v_parent_id_coloring_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coloring_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_coloring_pages_v" ADD CONSTRAINT "_coloring_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_coloring_pages_v" ADD CONSTRAINT "_coloring_pages_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_coloring_pages_v_texts" ADD CONSTRAINT "_coloring_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_coloring_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "name_templates" ADD CONSTRAINT "name_templates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coloring_pages_fk" FOREIGN KEY ("coloring_pages_id") REFERENCES "public"."coloring_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_names_fk" FOREIGN KEY ("names_id") REFERENCES "public"."names"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_name_templates_fk" FOREIGN KEY ("name_templates_id") REFERENCES "public"."name_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_name_imports_fk" FOREIGN KEY ("name_imports_id") REFERENCES "public"."name_imports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_logs_fk" FOREIGN KEY ("search_logs_id") REFERENCES "public"."search_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "coloring_pages_image_idx" ON "coloring_pages" USING btree ("image_id");
  CREATE INDEX "coloring_pages_category_idx" ON "coloring_pages" USING btree ("category_id");
  CREATE UNIQUE INDEX "coloring_pages_slug_idx" ON "coloring_pages" USING btree ("slug");
  CREATE INDEX "coloring_pages_updated_at_idx" ON "coloring_pages" USING btree ("updated_at");
  CREATE INDEX "coloring_pages_created_at_idx" ON "coloring_pages" USING btree ("created_at");
  CREATE INDEX "coloring_pages__status_idx" ON "coloring_pages" USING btree ("_status");
  CREATE INDEX "coloring_pages_texts_order_parent" ON "coloring_pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_coloring_pages_v_parent_idx" ON "_coloring_pages_v" USING btree ("parent_id");
  CREATE INDEX "_coloring_pages_v_version_version_image_idx" ON "_coloring_pages_v" USING btree ("version_image_id");
  CREATE INDEX "_coloring_pages_v_version_version_category_idx" ON "_coloring_pages_v" USING btree ("version_category_id");
  CREATE INDEX "_coloring_pages_v_version_version_slug_idx" ON "_coloring_pages_v" USING btree ("version_slug");
  CREATE INDEX "_coloring_pages_v_version_version_updated_at_idx" ON "_coloring_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_coloring_pages_v_version_version_created_at_idx" ON "_coloring_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_coloring_pages_v_version_version__status_idx" ON "_coloring_pages_v" USING btree ("version__status");
  CREATE INDEX "_coloring_pages_v_created_at_idx" ON "_coloring_pages_v" USING btree ("created_at");
  CREATE INDEX "_coloring_pages_v_updated_at_idx" ON "_coloring_pages_v" USING btree ("updated_at");
  CREATE INDEX "_coloring_pages_v_latest_idx" ON "_coloring_pages_v" USING btree ("latest");
  CREATE INDEX "_coloring_pages_v_texts_order_parent" ON "_coloring_pages_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "names_slug_idx" ON "names" USING btree ("slug");
  CREATE INDEX "names_published_idx" ON "names" USING btree ("published");
  CREATE INDEX "names_updated_at_idx" ON "names" USING btree ("updated_at");
  CREATE INDEX "names_created_at_idx" ON "names" USING btree ("created_at");
  CREATE INDEX "name_templates_image_idx" ON "name_templates" USING btree ("image_id");
  CREATE INDEX "name_templates_updated_at_idx" ON "name_templates" USING btree ("updated_at");
  CREATE INDEX "name_templates_created_at_idx" ON "name_templates" USING btree ("created_at");
  CREATE INDEX "name_imports_updated_at_idx" ON "name_imports" USING btree ("updated_at");
  CREATE INDEX "name_imports_created_at_idx" ON "name_imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "name_imports_filename_idx" ON "name_imports" USING btree ("filename");
  CREATE UNIQUE INDEX "search_logs_query_idx" ON "search_logs" USING btree ("query");
  CREATE INDEX "search_logs_updated_at_idx" ON "search_logs" USING btree ("updated_at");
  CREATE INDEX "search_logs_created_at_idx" ON "search_logs" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_coloring_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("coloring_pages_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_names_id_idx" ON "payload_locked_documents_rels" USING btree ("names_id");
  CREATE INDEX "payload_locked_documents_rels_name_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("name_templates_id");
  CREATE INDEX "payload_locked_documents_rels_name_imports_id_idx" ON "payload_locked_documents_rels" USING btree ("name_imports_id");
  CREATE INDEX "payload_locked_documents_rels_search_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("search_logs_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "coloring_pages" CASCADE;
  DROP TABLE "coloring_pages_texts" CASCADE;
  DROP TABLE "_coloring_pages_v" CASCADE;
  DROP TABLE "_coloring_pages_v_texts" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "names" CASCADE;
  DROP TABLE "name_templates" CASCADE;
  DROP TABLE "name_imports" CASCADE;
  DROP TABLE "search_logs" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_coloring_pages_difficulty";
  DROP TYPE "public"."enum_coloring_pages_audience";
  DROP TYPE "public"."enum_coloring_pages_status";
  DROP TYPE "public"."enum__coloring_pages_v_version_difficulty";
  DROP TYPE "public"."enum__coloring_pages_v_version_audience";
  DROP TYPE "public"."enum__coloring_pages_v_version_status";
  DROP TYPE "public"."enum_names_gender";
  DROP TYPE "public"."enum_name_templates_letter_case";`)
}
