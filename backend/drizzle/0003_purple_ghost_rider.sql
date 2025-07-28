CREATE TABLE "bag_customizable_items" (
	"bag_type_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "bag_customizable_items_bag_type_id_product_id_pk" PRIMARY KEY("bag_type_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "bag_fixed_items" (
	"bag_type_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "bag_fixed_items_bag_type_id_product_id_pk" PRIMARY KEY("bag_type_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "bag_types" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "bag_customizable_items" ADD CONSTRAINT "bag_customizable_items_bag_type_id_bag_types_id_fk" FOREIGN KEY ("bag_type_id") REFERENCES "public"."bag_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bag_customizable_items" ADD CONSTRAINT "bag_customizable_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bag_fixed_items" ADD CONSTRAINT "bag_fixed_items_bag_type_id_bag_types_id_fk" FOREIGN KEY ("bag_type_id") REFERENCES "public"."bag_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bag_fixed_items" ADD CONSTRAINT "bag_fixed_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;