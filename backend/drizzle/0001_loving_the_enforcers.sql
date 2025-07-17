CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"unit" text NOT NULL,
	"image_url" text,
	"description" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"nutrition_info" json
);
