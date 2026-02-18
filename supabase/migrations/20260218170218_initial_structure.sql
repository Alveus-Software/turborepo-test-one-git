drop extension if exists "pg_net";

create type "public"."appointment_statuses" as enum ('confirmed', 'completed', 'canceled');

create type "public"."product_type" as enum ('article', 'service');

create sequence "public"."sale_orders_order_number_seq";


  create table "public"."addresses" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "postal_code" text not null,
    "neighborhood" text not null,
    "street" text not null,
    "exterior_number" text not null,
    "interior_number" text,
    "phone_number" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone,
    "email" text,
    "full_name" text
      );


alter table "public"."addresses" enable row level security;


  create table "public"."appointment_status" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "name" text not null,
    "description" text
      );


alter table "public"."appointment_status" enable row level security;


  create table "public"."appointments" (
    "id" uuid not null default gen_random_uuid(),
    "client_name" text,
    "client_email" text,
    "created_by" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone,
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone,
    "client_phone" text,
    "appointment_datetime" timestamp with time zone,
    "booked_at" timestamp with time zone,
    "booked_by_user_id" uuid,
    "cancelled_at" timestamp with time zone,
    "client_notes" text,
    "notes" text,
    "space_owner_user_id" uuid default auth.uid(),
    "status_id" uuid default '517e3cc0-0763-4fd0-9195-756fe4617706'::uuid
      );


alter table "public"."appointments" enable row level security;


  create table "public"."billing_info" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "rfc" character varying(13) not null,
    "name" character varying(255) not null,
    "tax_regime" character varying(5) not null,
    "cfdi_use" character varying(5) not null,
    "tax_zip_code" character varying(10) not null,
    "email" character varying(150),
    "street" character varying(150),
    "exterior_number" character varying(10),
    "interior_number" character varying(10),
    "neighborhood" character varying(100),
    "locality" character varying(100),
    "municipality" character varying(100),
    "state" character varying(100),
    "country" character varying(50) default 'MEX'::character varying,
    "zip_code" character varying(10),
    "created_by" uuid,
    "updated_by" uuid,
    "deleted_by" uuid,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "deleted_at" timestamp without time zone,
    "order_number" text,
    "id_facrutama" text
      );


alter table "public"."billing_info" enable row level security;


  create table "public"."companies" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "street" text,
    "colony" text,
    "city" text,
    "state" text,
    "zip_code" text,
    "address_number" text,
    "phone" text,
    "cellphone" text,
    "website" text,
    "rfc" text,
    "parent_company" uuid,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid
      );


alter table "public"."companies" enable row level security;


  create table "public"."configurations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp without time zone,
    "created_by" uuid,
    "updated_at" timestamp without time zone,
    "updated_by" uuid,
    "active" boolean default true,
    "company_id" uuid,
    "key" text,
    "value" text
      );


alter table "public"."configurations" enable row level security;


  create table "public"."contact_groups" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "title" text not null,
    "description" text,
    "active" boolean not null default true,
    "image_url" text
      );


alter table "public"."contact_groups" enable row level security;


  create table "public"."contacts" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text,
    "job_position" text,
    "phone" text,
    "mobile" text,
    "email" text,
    "website" text,
    "title" text,
    "rfc" text,
    "curp" text,
    "related_user_id" uuid default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "birth_date" date,
    "notes" text
      );


alter table "public"."contacts" enable row level security;


  create table "public"."group_contacts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "id_contacts" uuid,
    "id_contact_groups" uuid,
    "active" boolean not null
      );


alter table "public"."group_contacts" enable row level security;


  create table "public"."inventories_locations" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "is_write_protected" boolean default false,
    "sucursal_id" uuid
      );


alter table "public"."inventories_locations" enable row level security;


  create table "public"."inventories_movements" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid not null,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone,
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone,
    "quantity" smallint,
    "from_location" uuid default gen_random_uuid(),
    "to_location" uuid default gen_random_uuid(),
    "related_movement_id" uuid,
    "movement_type" text,
    "reference_id" uuid,
    "notes" text
      );


alter table "public"."inventories_movements" enable row level security;


  create table "public"."measurements" (
    "id" uuid not null default gen_random_uuid(),
    "quantity" text,
    "reference" uuid,
    "unspsc" uuid,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "unit" text
      );


alter table "public"."measurements" enable row level security;


  create table "public"."modules" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "code" text not null,
    "name" text not null,
    "path" text not null,
    "description" text,
    "icon" text,
    "parent_module_id" uuid,
    "active" boolean not null default true,
    "created_by" uuid default auth.uid(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "sidebar_number" smallint
      );


alter table "public"."modules" enable row level security;


  create table "public"."permissions" (
    "id" uuid not null default gen_random_uuid(),
    "module_id" uuid not null,
    "code" character varying(100) not null,
    "name" character varying(100) not null,
    "description" text not null,
    "active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid
      );


alter table "public"."permissions" enable row level security;


  create table "public"."permissions_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "id_profile" uuid,
    "id_permission" uuid,
    "active" boolean not null default true
      );


alter table "public"."permissions_profiles" enable row level security;


  create table "public"."platforms" (
    "id" uuid not null default gen_random_uuid(),
    "code" text,
    "name" text,
    "description" text,
    "domain" text,
    "contact_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "is_write_protected" boolean default false
      );


alter table "public"."platforms" enable row level security;


  create table "public"."platforms-modules" (
    "id" uuid not null default gen_random_uuid(),
    "id_platform" uuid,
    "id_selectable_module" uuid,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid default gen_random_uuid()
      );


alter table "public"."platforms-modules" enable row level security;


  create table "public"."postal_codes" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "zone_id" uuid,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone,
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone
      );


alter table "public"."postal_codes" enable row level security;


  create table "public"."price_lists" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "code" text not null,
    "name" text not null,
    "description" text,
    "active" boolean not null default true
      );


alter table "public"."price_lists" enable row level security;


  create table "public"."product_categories" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "image_url" text,
    "active" boolean default true,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone
      );


alter table "public"."product_categories" enable row level security;


  create table "public"."product_taxes" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid default auth.uid(),
    "tax_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone default now(),
    "updated_by" uuid default auth.uid(),
    "deleted_at" timestamp with time zone default now(),
    "deleted_by" uuid default auth.uid()
      );


alter table "public"."product_taxes" enable row level security;


  create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "code" text,
    "bar_code" text,
    "name" text not null,
    "description" text,
    "image_url" text,
    "id_price_list" uuid,
    "category_id" uuid,
    "cost_price" numeric(10,2) default 0.00,
    "is_available" boolean default true,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone default now(),
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone,
    "name_unaccent" text,
    "quantity" integer default 0,
    "measure_unit" uuid,
    "type" public.product_type
      );


alter table "public"."products" enable row level security;


  create table "public"."products_price_lists" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "price_list_id" uuid,
    "product_id" uuid,
    "price" numeric
      );


alter table "public"."products_price_lists" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "code" text,
    "name" text,
    "active" boolean default true,
    "is_write_protected" boolean default false,
    "hierarchy" smallint
      );


alter table "public"."profiles" enable row level security;


  create table "public"."sale_order_details" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid,
    "sale_order_id" uuid,
    "quantity" numeric not null,
    "product_price" numeric not null
      );


alter table "public"."sale_order_details" enable row level security;


  create table "public"."sale_order_types" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "name" text not null
      );


alter table "public"."sale_order_types" enable row level security;


  create table "public"."sale_orders" (
    "id" uuid not null default gen_random_uuid(),
    "sale_order_type" uuid,
    "order_number" bigint not null default nextval('public.sale_orders_order_number_seq'::regclass),
    "user_id" uuid,
    "status" text default 'Pendiente de pago'::text,
    "created_at" timestamp with time zone default now(),
    "shipping_cost" numeric(10,2) not null default 0,
    "special_instructions" text,
    "delivery_instructions" text,
    "assigned_delivery_driver" uuid,
    "address" uuid,
    "delivery_time" smallint,
    "assigned_delivery_time_at" timestamp with time zone
      );


alter table "public"."sale_orders" enable row level security;


  create table "public"."selectable_modules" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid
      );


alter table "public"."selectable_modules" enable row level security;


  create table "public"."taxes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "name" text not null,
    "description" text,
    "tax_type" text not null default 'percentage'::text,
    "rate" numeric not null,
    "is_active" boolean default true,
    "general_type" text,
    "sat_tax_type" text
      );


alter table "public"."taxes" enable row level security;


  create table "public"."unspsc" (
    "id" uuid not null default gen_random_uuid(),
    "code" text,
    "name" text,
    "type" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid
      );


alter table "public"."unspsc" enable row level security;


  create table "public"."users" (
    "id" uuid not null,
    "full_name" text,
    "email" text,
    "active" boolean default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone,
    "profile_id" uuid default '16a00990-a80e-44c8-8580-4faa17438609'::uuid,
    "avatar_url" text,
    "username" text,
    "website" text,
    "user_code" text
      );


alter table "public"."users" enable row level security;


  create table "public"."zones" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "shipping_price" numeric(10,2) not null,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_by" uuid,
    "updated_at" timestamp with time zone,
    "deleted_by" uuid,
    "deleted_at" timestamp with time zone
      );


alter table "public"."zones" enable row level security;

alter sequence "public"."sale_orders_order_number_seq" owned by "public"."sale_orders"."order_number";

CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id);

CREATE UNIQUE INDEX appointment_datetime_owner_active_unique ON public.appointments USING btree (appointment_datetime, space_owner_user_id) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX appointment_status_pkey ON public.appointment_status USING btree (id);

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);

CREATE UNIQUE INDEX billing_info_pkey ON public.billing_info USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX configurations_pkey ON public.configurations USING btree (id);

CREATE UNIQUE INDEX contact_groups_pkey ON public.contact_groups USING btree (id);

CREATE UNIQUE INDEX contacts_pkey ON public.contacts USING btree (id);

CREATE UNIQUE INDEX group_contacts_pkey ON public.group_contacts USING btree (id);

CREATE UNIQUE INDEX group_contacts_unique_contact_group ON public.group_contacts USING btree (id_contacts, id_contact_groups);

CREATE INDEX idx_permissions_deleted_at ON public.permissions USING btree (deleted_at);

CREATE INDEX idx_permissions_module_id ON public.permissions USING btree (module_id);

CREATE INDEX idx_permissions_status ON public.permissions USING btree (active);

CREATE UNIQUE INDEX inventories_locations_pkey ON public.inventories_locations USING btree (id);

CREATE UNIQUE INDEX inventories_pkey ON public.inventories_movements USING btree (id);

CREATE UNIQUE INDEX measurements_pkey ON public.measurements USING btree (id);

CREATE UNIQUE INDEX modules_code_active_unique ON public.modules USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX modules_path_active_unique ON public.modules USING btree (path) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX modules_pkey ON public.modules USING btree (id);

CREATE UNIQUE INDEX permissions_code_active_unique ON public.permissions USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX permissions_pkey ON public.permissions USING btree (id);

CREATE UNIQUE INDEX permissions_profiles_pkey ON public.permissions_profiles USING btree (id);

CREATE UNIQUE INDEX "platforms-modules_pkey" ON public."platforms-modules" USING btree (id);

CREATE UNIQUE INDEX platforms_pkey ON public.platforms USING btree (id);

CREATE UNIQUE INDEX postal_code_pkey ON public.postal_codes USING btree (id);

CREATE UNIQUE INDEX price_lists_code_active_unique ON public.price_lists USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX price_lists_pkey ON public.price_lists USING btree (id);

CREATE UNIQUE INDEX product_categories_pkey ON public.product_categories USING btree (id);

CREATE UNIQUE INDEX product_taxes_pkey ON public.product_taxes USING btree (id);

CREATE UNIQUE INDEX products_bar_code_active_unique ON public.products USING btree (bar_code) WHERE ((deleted_at IS NULL) AND (is_available = true));

CREATE UNIQUE INDEX products_code_active_unique ON public.products USING btree (code) WHERE ((deleted_at IS NULL) AND (is_available = true));

CREATE UNIQUE INDEX products_name_unaccent_active_unique ON public.products USING btree (name_unaccent) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX products_price_lists_pkey ON public.products_price_lists USING btree (id);

CREATE UNIQUE INDEX profiles_code_active_unique ON public.profiles USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX purchase_order_details_pkey ON public.sale_order_details USING btree (id);

CREATE UNIQUE INDEX purchase_order_types_code_key ON public.sale_order_types USING btree (code);

CREATE UNIQUE INDEX purchase_order_types_pkey ON public.sale_order_types USING btree (id);

CREATE UNIQUE INDEX purchase_orders_order_number_key ON public.sale_orders USING btree (order_number);

CREATE UNIQUE INDEX purchase_orders_pkey ON public.sale_orders USING btree (id);

CREATE UNIQUE INDEX selectable_modules_pkey ON public.selectable_modules USING btree (id);

CREATE UNIQUE INDEX taxes_pkey ON public.taxes USING btree (id);

CREATE UNIQUE INDEX unspsc_pkey ON public.unspsc USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_user_code_key ON public.users USING btree (user_code);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX zone_pkey ON public.zones USING btree (id);

alter table "public"."addresses" add constraint "addresses_pkey" PRIMARY KEY using index "addresses_pkey";

alter table "public"."appointment_status" add constraint "appointment_status_pkey" PRIMARY KEY using index "appointment_status_pkey";

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."billing_info" add constraint "billing_info_pkey" PRIMARY KEY using index "billing_info_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."configurations" add constraint "configurations_pkey" PRIMARY KEY using index "configurations_pkey";

alter table "public"."contact_groups" add constraint "contact_groups_pkey" PRIMARY KEY using index "contact_groups_pkey";

alter table "public"."contacts" add constraint "contacts_pkey" PRIMARY KEY using index "contacts_pkey";

alter table "public"."group_contacts" add constraint "group_contacts_pkey" PRIMARY KEY using index "group_contacts_pkey";

alter table "public"."inventories_locations" add constraint "inventories_locations_pkey" PRIMARY KEY using index "inventories_locations_pkey";

alter table "public"."inventories_movements" add constraint "inventories_pkey" PRIMARY KEY using index "inventories_pkey";

alter table "public"."measurements" add constraint "measurements_pkey" PRIMARY KEY using index "measurements_pkey";

alter table "public"."modules" add constraint "modules_pkey" PRIMARY KEY using index "modules_pkey";

alter table "public"."permissions" add constraint "permissions_pkey" PRIMARY KEY using index "permissions_pkey";

alter table "public"."permissions_profiles" add constraint "permissions_profiles_pkey" PRIMARY KEY using index "permissions_profiles_pkey";

alter table "public"."platforms" add constraint "platforms_pkey" PRIMARY KEY using index "platforms_pkey";

alter table "public"."platforms-modules" add constraint "platforms-modules_pkey" PRIMARY KEY using index "platforms-modules_pkey";

alter table "public"."postal_codes" add constraint "postal_code_pkey" PRIMARY KEY using index "postal_code_pkey";

alter table "public"."price_lists" add constraint "price_lists_pkey" PRIMARY KEY using index "price_lists_pkey";

alter table "public"."product_categories" add constraint "product_categories_pkey" PRIMARY KEY using index "product_categories_pkey";

alter table "public"."product_taxes" add constraint "product_taxes_pkey" PRIMARY KEY using index "product_taxes_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."products_price_lists" add constraint "products_price_lists_pkey" PRIMARY KEY using index "products_price_lists_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."sale_order_details" add constraint "purchase_order_details_pkey" PRIMARY KEY using index "purchase_order_details_pkey";

alter table "public"."sale_order_types" add constraint "purchase_order_types_pkey" PRIMARY KEY using index "purchase_order_types_pkey";

alter table "public"."sale_orders" add constraint "purchase_orders_pkey" PRIMARY KEY using index "purchase_orders_pkey";

alter table "public"."selectable_modules" add constraint "selectable_modules_pkey" PRIMARY KEY using index "selectable_modules_pkey";

alter table "public"."taxes" add constraint "taxes_pkey" PRIMARY KEY using index "taxes_pkey";

alter table "public"."unspsc" add constraint "unspsc_pkey" PRIMARY KEY using index "unspsc_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."zones" add constraint "zone_pkey" PRIMARY KEY using index "zone_pkey";

alter table "public"."addresses" add constraint "addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "addresses_user_id_fkey";

alter table "public"."appointments" add constraint "appointments_booked_by_user_id_fkey" FOREIGN KEY (booked_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."appointments" validate constraint "appointments_booked_by_user_id_fkey";

alter table "public"."appointments" add constraint "appointments_space_owner_user_id_fkey" FOREIGN KEY (space_owner_user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE SET DEFAULT not valid;

alter table "public"."appointments" validate constraint "appointments_space_owner_user_id_fkey";

alter table "public"."appointments" add constraint "appointments_status_id_fkey" FOREIGN KEY (status_id) REFERENCES public.appointment_status(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."appointments" validate constraint "appointments_status_id_fkey";

alter table "public"."billing_info" add constraint "active_record" CHECK ((((deleted_at IS NULL) AND (deleted_by IS NULL)) OR ((deleted_at IS NOT NULL) AND (deleted_by IS NOT NULL)))) not valid;

alter table "public"."billing_info" validate constraint "active_record";

alter table "public"."billing_info" add constraint "billing_info_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."billing_info" validate constraint "billing_info_created_by_fkey";

alter table "public"."billing_info" add constraint "billing_info_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."billing_info" validate constraint "billing_info_deleted_by_fkey";

alter table "public"."billing_info" add constraint "billing_info_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."billing_info" validate constraint "billing_info_updated_by_fkey";

alter table "public"."billing_info" add constraint "billing_info_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."billing_info" validate constraint "billing_info_user_id_fkey";

alter table "public"."companies" add constraint "companies_parent_company_fkey" FOREIGN KEY (parent_company) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."companies" validate constraint "companies_parent_company_fkey";

alter table "public"."configurations" add constraint "configurations_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."configurations" validate constraint "configurations_company_id_fkey";

alter table "public"."contacts" add constraint "contacts_related_user_id_fkey" FOREIGN KEY (related_user_id) REFERENCES public.users(id) not valid;

alter table "public"."contacts" validate constraint "contacts_related_user_id_fkey";

alter table "public"."group_contacts" add constraint "group_contacts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) not valid;

alter table "public"."group_contacts" validate constraint "group_contacts_created_by_fkey";

alter table "public"."group_contacts" add constraint "group_contacts_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES public.users(id) not valid;

alter table "public"."group_contacts" validate constraint "group_contacts_deleted_by_fkey";

alter table "public"."group_contacts" add constraint "group_contacts_id_contact_groups_fkey" FOREIGN KEY (id_contact_groups) REFERENCES public.contact_groups(id) not valid;

alter table "public"."group_contacts" validate constraint "group_contacts_id_contact_groups_fkey";

alter table "public"."group_contacts" add constraint "group_contacts_id_contacts_fkey" FOREIGN KEY (id_contacts) REFERENCES public.contacts(id) not valid;

alter table "public"."group_contacts" validate constraint "group_contacts_id_contacts_fkey";

alter table "public"."group_contacts" add constraint "group_contacts_unique_contact_group" UNIQUE using index "group_contacts_unique_contact_group";

alter table "public"."group_contacts" add constraint "group_contacts_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."group_contacts" validate constraint "group_contacts_updated_by_fkey";

alter table "public"."inventories_movements" add constraint "inventories_from_location_fkey" FOREIGN KEY (from_location) REFERENCES public.inventories_locations(id) not valid;

alter table "public"."inventories_movements" validate constraint "inventories_from_location_fkey";

alter table "public"."inventories_movements" add constraint "inventories_movement_type_check" CHECK ((movement_type = ANY (ARRAY['sale'::text, 'transfer'::text, 'adjustment'::text, 'loss'::text, 'return'::text, 'initial'::text]))) not valid;

alter table "public"."inventories_movements" validate constraint "inventories_movement_type_check";

alter table "public"."inventories_movements" add constraint "inventories_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."inventories_movements" validate constraint "inventories_product_id_fkey";

alter table "public"."inventories_movements" add constraint "inventories_to_location_fkey" FOREIGN KEY (to_location) REFERENCES public.inventories_locations(id) not valid;

alter table "public"."inventories_movements" validate constraint "inventories_to_location_fkey";

alter table "public"."measurements" add constraint "measurements_reference_fkey" FOREIGN KEY (reference) REFERENCES public.measurements(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."measurements" validate constraint "measurements_reference_fkey";

alter table "public"."measurements" add constraint "measurements_unspsc_fkey" FOREIGN KEY (unspsc) REFERENCES public.unspsc(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."measurements" validate constraint "measurements_unspsc_fkey";

alter table "public"."modules" add constraint "modules_parent_section_id_fkey" FOREIGN KEY (parent_module_id) REFERENCES public.modules(id) not valid;

alter table "public"."modules" validate constraint "modules_parent_section_id_fkey";

alter table "public"."permissions" add constraint "permissions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."permissions" validate constraint "permissions_created_by_fkey";

alter table "public"."permissions" add constraint "permissions_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."permissions" validate constraint "permissions_deleted_by_fkey";

alter table "public"."permissions" add constraint "permissions_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE not valid;

alter table "public"."permissions" validate constraint "permissions_module_id_fkey";

alter table "public"."permissions" add constraint "permissions_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."permissions" validate constraint "permissions_updated_by_fkey";

alter table "public"."permissions_profiles" add constraint "permissions_profiles_id_permission_fkey" FOREIGN KEY (id_permission) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."permissions_profiles" validate constraint "permissions_profiles_id_permission_fkey";

alter table "public"."permissions_profiles" add constraint "permissions_profiles_id_profile_fkey" FOREIGN KEY (id_profile) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."permissions_profiles" validate constraint "permissions_profiles_id_profile_fkey";

alter table "public"."platforms" add constraint "platforms_contact_id_fkey" FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."platforms" validate constraint "platforms_contact_id_fkey";

alter table "public"."platforms-modules" add constraint "platforms-modules_id_platform_fkey" FOREIGN KEY (id_platform) REFERENCES public.platforms(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."platforms-modules" validate constraint "platforms-modules_id_platform_fkey";

alter table "public"."platforms-modules" add constraint "platforms-modules_id_selectable_module_fkey" FOREIGN KEY (id_selectable_module) REFERENCES public.selectable_modules(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."platforms-modules" validate constraint "platforms-modules_id_selectable_module_fkey";

alter table "public"."postal_codes" add constraint "postal_code_zone_id_fkey" FOREIGN KEY (zone_id) REFERENCES public.zones(id) ON DELETE CASCADE not valid;

alter table "public"."postal_codes" validate constraint "postal_code_zone_id_fkey";

alter table "public"."product_taxes" add constraint "product_taxes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) not valid;

alter table "public"."product_taxes" validate constraint "product_taxes_created_by_fkey";

alter table "public"."product_taxes" add constraint "product_taxes_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES public.users(id) not valid;

alter table "public"."product_taxes" validate constraint "product_taxes_deleted_by_fkey";

alter table "public"."product_taxes" add constraint "product_taxes_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."product_taxes" validate constraint "product_taxes_product_id_fkey";

alter table "public"."product_taxes" add constraint "product_taxes_tax_id_fkey" FOREIGN KEY (tax_id) REFERENCES public.taxes(id) not valid;

alter table "public"."product_taxes" validate constraint "product_taxes_tax_id_fkey";

alter table "public"."product_taxes" add constraint "product_taxes_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."product_taxes" validate constraint "product_taxes_updated_by_fkey";

alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_category_id_fkey";

alter table "public"."products" add constraint "products_measure_unit_fkey" FOREIGN KEY (measure_unit) REFERENCES public.measurements(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."products" validate constraint "products_measure_unit_fkey";

alter table "public"."products_price_lists" add constraint "products_price_lists_price_list_id_fkey" FOREIGN KEY (price_list_id) REFERENCES public.price_lists(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."products_price_lists" validate constraint "products_price_lists_price_list_id_fkey";

alter table "public"."products_price_lists" add constraint "products_price_lists_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."products_price_lists" validate constraint "products_price_lists_product_id_fkey";

alter table "public"."profiles" add constraint "profiles_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_created_by_fkey";

alter table "public"."profiles" add constraint "profiles_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_deleted_by_fkey";

alter table "public"."profiles" add constraint "profiles_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_updated_by_fkey";

alter table "public"."sale_order_details" add constraint "purchase_order_details_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."sale_order_details" validate constraint "purchase_order_details_product_id_fkey";

alter table "public"."sale_order_details" add constraint "purchase_order_details_product_price_check" CHECK ((product_price >= (0)::numeric)) not valid;

alter table "public"."sale_order_details" validate constraint "purchase_order_details_product_price_check";

alter table "public"."sale_order_details" add constraint "purchase_order_details_quantity_check" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."sale_order_details" validate constraint "purchase_order_details_quantity_check";

alter table "public"."sale_order_details" add constraint "sale_order_details_sale_order_id_fkey" FOREIGN KEY (sale_order_id) REFERENCES public.sale_orders(id) ON DELETE CASCADE not valid;

alter table "public"."sale_order_details" validate constraint "sale_order_details_sale_order_id_fkey";

alter table "public"."sale_order_types" add constraint "purchase_order_types_code_key" UNIQUE using index "purchase_order_types_code_key";

alter table "public"."sale_orders" add constraint "purchase_orders_order_number_key" UNIQUE using index "purchase_orders_order_number_key";

alter table "public"."sale_orders" add constraint "purchase_orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."sale_orders" validate constraint "purchase_orders_user_id_fkey";

alter table "public"."sale_orders" add constraint "sale_orders_address_fkey" FOREIGN KEY (address) REFERENCES public.addresses(id) ON UPDATE CASCADE not valid;

alter table "public"."sale_orders" validate constraint "sale_orders_address_fkey";

alter table "public"."sale_orders" add constraint "sale_orders_assigned_delivery_driver_fkey" FOREIGN KEY (assigned_delivery_driver) REFERENCES public.users(id) not valid;

alter table "public"."sale_orders" validate constraint "sale_orders_assigned_delivery_driver_fkey";

alter table "public"."sale_orders" add constraint "sale_orders_sale_order_type_fkey" FOREIGN KEY (sale_order_type) REFERENCES public.sale_order_types(id) ON DELETE SET NULL not valid;

alter table "public"."sale_orders" validate constraint "sale_orders_sale_order_type_fkey";

alter table "public"."sale_orders" add constraint "sale_orders_status_check" CHECK ((status = ANY (ARRAY['Pendiente de pago'::text, 'Pagado'::text, 'Preparación'::text, 'En camino'::text, 'Entregado'::text, 'Cancelado'::text]))) not valid;

alter table "public"."sale_orders" validate constraint "sale_orders_status_check";

alter table "public"."sale_orders" add constraint "sale_orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."sale_orders" validate constraint "sale_orders_user_id_fkey";

alter table "public"."users" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."users" validate constraint "username_length";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET DEFAULT not valid;

alter table "public"."users" validate constraint "users_profile_id_fkey";

alter table "public"."users" add constraint "users_user_code_key" UNIQUE using index "users_user_code_key";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

alter table "public"."zones" add constraint "zone_shipping_price_check" CHECK ((shipping_price >= (0)::numeric)) not valid;

alter table "public"."zones" validate constraint "zone_shipping_price_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_contact_after_signup()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO public.contacts (
    full_name,
    email,
    related_user_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW.full_name,
    NEW.email,
    NEW.id,
    NOW(),
    NOW()
  );
RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_user_with_permissions(user_uuid uuid)
 RETURNS json
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', u.id,
    'full_name', u.full_name,
    'email', u.email,
    'active', u.active,
    'profile', json_build_object(
      'id', p.id,
      'name', p.name,
      'code', p.code,
      'active', p.active
    ),
    'permissions', COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', per.id,
          'code', per.code,
          'name', per.name,
          'description', per.description,
          'active', per.active,
          'module', jsonb_build_object(
            'id', m.id,
            'code', m.code,
            'name', m.name,
            'path', m.path,
            'icon', m.icon,
            'active', m.active
          )
        )
      ) FILTER (WHERE per.id IS NOT NULL),
      '[]'::json
    )
  )
  INTO result
  FROM users u
  JOIN profiles p ON p.id = u.profile_id
  LEFT JOIN permissions_profiles pp ON pp.id_profile = p.id AND pp.active = TRUE
  LEFT JOIN permissions per ON per.id = pp.id_permission AND per.active = TRUE
  LEFT JOIN modules m ON m.id = per.module_id AND m.active = TRUE
  WHERE u.id = user_uuid
  GROUP BY u.id, p.id;

  RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
  INSERT INTO public.users (
    id,
    full_name,
    email,
    active,
    created_at,
    updated_at,
    profile_id
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.email,
    true,
    NOW(),
    NOW(),
    '16a00990-a80e-44c8-8580-4faa17438609'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(
      EXCLUDED.full_name,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_child_module_paths()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_prefix_raw TEXT := OLD.path;
    new_prefix_raw TEXT := NEW.path;
    old_prefix TEXT;
    new_prefix TEXT;
    updated_count INT;
BEGIN
    -- Solo si cambió el path
    IF OLD.path IS DISTINCT FROM NEW.path THEN

        -- Si no hay valor antiguo, no hacer nada
        IF old_prefix_raw IS NULL OR old_prefix_raw = '' THEN
            RETURN NEW;
        END IF;

        -- Normalizar para asegurar que termine en '/'
        old_prefix := old_prefix_raw;
        new_prefix := new_prefix_raw;
        IF right(old_prefix, 1) <> '/' THEN
            old_prefix := old_prefix || '/';
        END IF;
        IF right(new_prefix, 1) <> '/' THEN
            new_prefix := new_prefix || '/';
        END IF;

        -- Actualizar solo aquellos paths cuyo prefijo exacto coincide (y el siguiente caracter es '/' o no existe)
        UPDATE modules
        SET path = new_prefix || substr(path, char_length(old_prefix) + 1)
        WHERE left(path, char_length(old_prefix)) = old_prefix
          AND id <> NEW.id
          AND deleted_at IS NULL;

        GET DIAGNOSTICS updated_count = ROW_COUNT;

        RAISE NOTICE 'Actualizados % módulos descendientes: % -> %',
            updated_count, old_prefix, new_prefix;
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_child_modules_path()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Verificar si el path del módulo padre ha cambiado
    IF OLD.path IS DISTINCT FROM NEW.path AND OLD.path IS NOT NULL AND NEW.path IS NOT NULL THEN
        -- Actualizar todos los módulos hijos
        UPDATE modules
        SET 
            path = NEW.path || SUBSTRING(path FROM LENGTH(OLD.path) + 1),
            updated_at = NOW(),
            updated_by = NEW.updated_by
        WHERE 
            parent_module_id = NEW.id
            AND path LIKE OLD.path || '%'
            AND deleted_at IS NULL;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_child_paths()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.path <> OLD.path THEN
    -- Actualiza los paths de los hijos usando solo la parte relativa
    UPDATE modules
    SET path = NEW.path || '/' || split_part(path, '/', 3)
    WHERE path LIKE OLD.path || '/%';
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_permissions_code_on_module_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Solo ejecutar si el código del módulo cambió
    IF OLD.code IS DISTINCT FROM NEW.code THEN
        
        -- Actualizar todos los permisos del módulo
        -- Reemplaza la parte después de ':' (código del módulo) 
        -- manteniendo la parte antes de ':' (código del permiso)
        UPDATE permissions
        SET code = split_part(code, ':', 1) || ':' || NEW.code
        WHERE module_id = NEW.id
        AND deleted_at IS NULL;  -- Solo actualizar permisos activos
        
        RAISE NOTICE 'Actualizados % permisos del módulo % (código: % -> %)', 
            (SELECT COUNT(*) FROM permissions WHERE module_id = NEW.id AND deleted_at IS NULL),
            NEW.id, 
            OLD.code, 
            NEW.code;
    END IF;
    
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."addresses" to "anon";

grant insert on table "public"."addresses" to "anon";

grant references on table "public"."addresses" to "anon";

grant select on table "public"."addresses" to "anon";

grant trigger on table "public"."addresses" to "anon";

grant truncate on table "public"."addresses" to "anon";

grant update on table "public"."addresses" to "anon";

grant delete on table "public"."addresses" to "authenticated";

grant insert on table "public"."addresses" to "authenticated";

grant references on table "public"."addresses" to "authenticated";

grant select on table "public"."addresses" to "authenticated";

grant trigger on table "public"."addresses" to "authenticated";

grant truncate on table "public"."addresses" to "authenticated";

grant update on table "public"."addresses" to "authenticated";

grant delete on table "public"."addresses" to "service_role";

grant insert on table "public"."addresses" to "service_role";

grant references on table "public"."addresses" to "service_role";

grant select on table "public"."addresses" to "service_role";

grant trigger on table "public"."addresses" to "service_role";

grant truncate on table "public"."addresses" to "service_role";

grant update on table "public"."addresses" to "service_role";

grant delete on table "public"."appointment_status" to "anon";

grant insert on table "public"."appointment_status" to "anon";

grant references on table "public"."appointment_status" to "anon";

grant select on table "public"."appointment_status" to "anon";

grant trigger on table "public"."appointment_status" to "anon";

grant truncate on table "public"."appointment_status" to "anon";

grant update on table "public"."appointment_status" to "anon";

grant delete on table "public"."appointment_status" to "authenticated";

grant insert on table "public"."appointment_status" to "authenticated";

grant references on table "public"."appointment_status" to "authenticated";

grant select on table "public"."appointment_status" to "authenticated";

grant trigger on table "public"."appointment_status" to "authenticated";

grant truncate on table "public"."appointment_status" to "authenticated";

grant update on table "public"."appointment_status" to "authenticated";

grant delete on table "public"."appointment_status" to "service_role";

grant insert on table "public"."appointment_status" to "service_role";

grant references on table "public"."appointment_status" to "service_role";

grant select on table "public"."appointment_status" to "service_role";

grant trigger on table "public"."appointment_status" to "service_role";

grant truncate on table "public"."appointment_status" to "service_role";

grant update on table "public"."appointment_status" to "service_role";

grant delete on table "public"."appointments" to "anon";

grant insert on table "public"."appointments" to "anon";

grant references on table "public"."appointments" to "anon";

grant select on table "public"."appointments" to "anon";

grant trigger on table "public"."appointments" to "anon";

grant truncate on table "public"."appointments" to "anon";

grant update on table "public"."appointments" to "anon";

grant delete on table "public"."appointments" to "authenticated";

grant insert on table "public"."appointments" to "authenticated";

grant references on table "public"."appointments" to "authenticated";

grant select on table "public"."appointments" to "authenticated";

grant trigger on table "public"."appointments" to "authenticated";

grant truncate on table "public"."appointments" to "authenticated";

grant update on table "public"."appointments" to "authenticated";

grant delete on table "public"."appointments" to "service_role";

grant insert on table "public"."appointments" to "service_role";

grant references on table "public"."appointments" to "service_role";

grant select on table "public"."appointments" to "service_role";

grant trigger on table "public"."appointments" to "service_role";

grant truncate on table "public"."appointments" to "service_role";

grant update on table "public"."appointments" to "service_role";

grant delete on table "public"."billing_info" to "anon";

grant insert on table "public"."billing_info" to "anon";

grant references on table "public"."billing_info" to "anon";

grant select on table "public"."billing_info" to "anon";

grant trigger on table "public"."billing_info" to "anon";

grant truncate on table "public"."billing_info" to "anon";

grant update on table "public"."billing_info" to "anon";

grant delete on table "public"."billing_info" to "authenticated";

grant insert on table "public"."billing_info" to "authenticated";

grant references on table "public"."billing_info" to "authenticated";

grant select on table "public"."billing_info" to "authenticated";

grant trigger on table "public"."billing_info" to "authenticated";

grant truncate on table "public"."billing_info" to "authenticated";

grant update on table "public"."billing_info" to "authenticated";

grant delete on table "public"."billing_info" to "service_role";

grant insert on table "public"."billing_info" to "service_role";

grant references on table "public"."billing_info" to "service_role";

grant select on table "public"."billing_info" to "service_role";

grant trigger on table "public"."billing_info" to "service_role";

grant truncate on table "public"."billing_info" to "service_role";

grant update on table "public"."billing_info" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."configurations" to "anon";

grant insert on table "public"."configurations" to "anon";

grant references on table "public"."configurations" to "anon";

grant select on table "public"."configurations" to "anon";

grant trigger on table "public"."configurations" to "anon";

grant truncate on table "public"."configurations" to "anon";

grant update on table "public"."configurations" to "anon";

grant delete on table "public"."configurations" to "authenticated";

grant insert on table "public"."configurations" to "authenticated";

grant references on table "public"."configurations" to "authenticated";

grant select on table "public"."configurations" to "authenticated";

grant trigger on table "public"."configurations" to "authenticated";

grant truncate on table "public"."configurations" to "authenticated";

grant update on table "public"."configurations" to "authenticated";

grant delete on table "public"."configurations" to "service_role";

grant insert on table "public"."configurations" to "service_role";

grant references on table "public"."configurations" to "service_role";

grant select on table "public"."configurations" to "service_role";

grant trigger on table "public"."configurations" to "service_role";

grant truncate on table "public"."configurations" to "service_role";

grant update on table "public"."configurations" to "service_role";

grant delete on table "public"."contact_groups" to "anon";

grant insert on table "public"."contact_groups" to "anon";

grant references on table "public"."contact_groups" to "anon";

grant select on table "public"."contact_groups" to "anon";

grant trigger on table "public"."contact_groups" to "anon";

grant truncate on table "public"."contact_groups" to "anon";

grant update on table "public"."contact_groups" to "anon";

grant delete on table "public"."contact_groups" to "authenticated";

grant insert on table "public"."contact_groups" to "authenticated";

grant references on table "public"."contact_groups" to "authenticated";

grant select on table "public"."contact_groups" to "authenticated";

grant trigger on table "public"."contact_groups" to "authenticated";

grant truncate on table "public"."contact_groups" to "authenticated";

grant update on table "public"."contact_groups" to "authenticated";

grant delete on table "public"."contact_groups" to "service_role";

grant insert on table "public"."contact_groups" to "service_role";

grant references on table "public"."contact_groups" to "service_role";

grant select on table "public"."contact_groups" to "service_role";

grant trigger on table "public"."contact_groups" to "service_role";

grant truncate on table "public"."contact_groups" to "service_role";

grant update on table "public"."contact_groups" to "service_role";

grant delete on table "public"."contacts" to "anon";

grant insert on table "public"."contacts" to "anon";

grant references on table "public"."contacts" to "anon";

grant select on table "public"."contacts" to "anon";

grant trigger on table "public"."contacts" to "anon";

grant truncate on table "public"."contacts" to "anon";

grant update on table "public"."contacts" to "anon";

grant delete on table "public"."contacts" to "authenticated";

grant insert on table "public"."contacts" to "authenticated";

grant references on table "public"."contacts" to "authenticated";

grant select on table "public"."contacts" to "authenticated";

grant trigger on table "public"."contacts" to "authenticated";

grant truncate on table "public"."contacts" to "authenticated";

grant update on table "public"."contacts" to "authenticated";

grant delete on table "public"."contacts" to "service_role";

grant insert on table "public"."contacts" to "service_role";

grant references on table "public"."contacts" to "service_role";

grant select on table "public"."contacts" to "service_role";

grant trigger on table "public"."contacts" to "service_role";

grant truncate on table "public"."contacts" to "service_role";

grant update on table "public"."contacts" to "service_role";

grant delete on table "public"."group_contacts" to "anon";

grant insert on table "public"."group_contacts" to "anon";

grant references on table "public"."group_contacts" to "anon";

grant select on table "public"."group_contacts" to "anon";

grant trigger on table "public"."group_contacts" to "anon";

grant truncate on table "public"."group_contacts" to "anon";

grant update on table "public"."group_contacts" to "anon";

grant delete on table "public"."group_contacts" to "authenticated";

grant insert on table "public"."group_contacts" to "authenticated";

grant references on table "public"."group_contacts" to "authenticated";

grant select on table "public"."group_contacts" to "authenticated";

grant trigger on table "public"."group_contacts" to "authenticated";

grant truncate on table "public"."group_contacts" to "authenticated";

grant update on table "public"."group_contacts" to "authenticated";

grant delete on table "public"."group_contacts" to "service_role";

grant insert on table "public"."group_contacts" to "service_role";

grant references on table "public"."group_contacts" to "service_role";

grant select on table "public"."group_contacts" to "service_role";

grant trigger on table "public"."group_contacts" to "service_role";

grant truncate on table "public"."group_contacts" to "service_role";

grant update on table "public"."group_contacts" to "service_role";

grant delete on table "public"."inventories_locations" to "anon";

grant insert on table "public"."inventories_locations" to "anon";

grant references on table "public"."inventories_locations" to "anon";

grant select on table "public"."inventories_locations" to "anon";

grant trigger on table "public"."inventories_locations" to "anon";

grant truncate on table "public"."inventories_locations" to "anon";

grant update on table "public"."inventories_locations" to "anon";

grant delete on table "public"."inventories_locations" to "authenticated";

grant insert on table "public"."inventories_locations" to "authenticated";

grant references on table "public"."inventories_locations" to "authenticated";

grant select on table "public"."inventories_locations" to "authenticated";

grant trigger on table "public"."inventories_locations" to "authenticated";

grant truncate on table "public"."inventories_locations" to "authenticated";

grant update on table "public"."inventories_locations" to "authenticated";

grant delete on table "public"."inventories_locations" to "service_role";

grant insert on table "public"."inventories_locations" to "service_role";

grant references on table "public"."inventories_locations" to "service_role";

grant select on table "public"."inventories_locations" to "service_role";

grant trigger on table "public"."inventories_locations" to "service_role";

grant truncate on table "public"."inventories_locations" to "service_role";

grant update on table "public"."inventories_locations" to "service_role";

grant delete on table "public"."inventories_movements" to "anon";

grant insert on table "public"."inventories_movements" to "anon";

grant references on table "public"."inventories_movements" to "anon";

grant select on table "public"."inventories_movements" to "anon";

grant trigger on table "public"."inventories_movements" to "anon";

grant truncate on table "public"."inventories_movements" to "anon";

grant update on table "public"."inventories_movements" to "anon";

grant delete on table "public"."inventories_movements" to "authenticated";

grant insert on table "public"."inventories_movements" to "authenticated";

grant references on table "public"."inventories_movements" to "authenticated";

grant select on table "public"."inventories_movements" to "authenticated";

grant trigger on table "public"."inventories_movements" to "authenticated";

grant truncate on table "public"."inventories_movements" to "authenticated";

grant update on table "public"."inventories_movements" to "authenticated";

grant delete on table "public"."inventories_movements" to "service_role";

grant insert on table "public"."inventories_movements" to "service_role";

grant references on table "public"."inventories_movements" to "service_role";

grant select on table "public"."inventories_movements" to "service_role";

grant trigger on table "public"."inventories_movements" to "service_role";

grant truncate on table "public"."inventories_movements" to "service_role";

grant update on table "public"."inventories_movements" to "service_role";

grant delete on table "public"."measurements" to "anon";

grant insert on table "public"."measurements" to "anon";

grant references on table "public"."measurements" to "anon";

grant select on table "public"."measurements" to "anon";

grant trigger on table "public"."measurements" to "anon";

grant truncate on table "public"."measurements" to "anon";

grant update on table "public"."measurements" to "anon";

grant delete on table "public"."measurements" to "authenticated";

grant insert on table "public"."measurements" to "authenticated";

grant references on table "public"."measurements" to "authenticated";

grant select on table "public"."measurements" to "authenticated";

grant trigger on table "public"."measurements" to "authenticated";

grant truncate on table "public"."measurements" to "authenticated";

grant update on table "public"."measurements" to "authenticated";

grant delete on table "public"."measurements" to "service_role";

grant insert on table "public"."measurements" to "service_role";

grant references on table "public"."measurements" to "service_role";

grant select on table "public"."measurements" to "service_role";

grant trigger on table "public"."measurements" to "service_role";

grant truncate on table "public"."measurements" to "service_role";

grant update on table "public"."measurements" to "service_role";

grant delete on table "public"."modules" to "anon";

grant insert on table "public"."modules" to "anon";

grant references on table "public"."modules" to "anon";

grant select on table "public"."modules" to "anon";

grant trigger on table "public"."modules" to "anon";

grant truncate on table "public"."modules" to "anon";

grant update on table "public"."modules" to "anon";

grant delete on table "public"."modules" to "authenticated";

grant insert on table "public"."modules" to "authenticated";

grant references on table "public"."modules" to "authenticated";

grant select on table "public"."modules" to "authenticated";

grant trigger on table "public"."modules" to "authenticated";

grant truncate on table "public"."modules" to "authenticated";

grant update on table "public"."modules" to "authenticated";

grant delete on table "public"."modules" to "service_role";

grant insert on table "public"."modules" to "service_role";

grant references on table "public"."modules" to "service_role";

grant select on table "public"."modules" to "service_role";

grant trigger on table "public"."modules" to "service_role";

grant truncate on table "public"."modules" to "service_role";

grant update on table "public"."modules" to "service_role";

grant delete on table "public"."permissions" to "anon";

grant insert on table "public"."permissions" to "anon";

grant references on table "public"."permissions" to "anon";

grant select on table "public"."permissions" to "anon";

grant trigger on table "public"."permissions" to "anon";

grant truncate on table "public"."permissions" to "anon";

grant update on table "public"."permissions" to "anon";

grant delete on table "public"."permissions" to "authenticated";

grant insert on table "public"."permissions" to "authenticated";

grant references on table "public"."permissions" to "authenticated";

grant select on table "public"."permissions" to "authenticated";

grant trigger on table "public"."permissions" to "authenticated";

grant truncate on table "public"."permissions" to "authenticated";

grant update on table "public"."permissions" to "authenticated";

grant delete on table "public"."permissions" to "service_role";

grant insert on table "public"."permissions" to "service_role";

grant references on table "public"."permissions" to "service_role";

grant select on table "public"."permissions" to "service_role";

grant trigger on table "public"."permissions" to "service_role";

grant truncate on table "public"."permissions" to "service_role";

grant update on table "public"."permissions" to "service_role";

grant delete on table "public"."permissions_profiles" to "anon";

grant insert on table "public"."permissions_profiles" to "anon";

grant references on table "public"."permissions_profiles" to "anon";

grant select on table "public"."permissions_profiles" to "anon";

grant trigger on table "public"."permissions_profiles" to "anon";

grant truncate on table "public"."permissions_profiles" to "anon";

grant update on table "public"."permissions_profiles" to "anon";

grant delete on table "public"."permissions_profiles" to "authenticated";

grant insert on table "public"."permissions_profiles" to "authenticated";

grant references on table "public"."permissions_profiles" to "authenticated";

grant select on table "public"."permissions_profiles" to "authenticated";

grant trigger on table "public"."permissions_profiles" to "authenticated";

grant truncate on table "public"."permissions_profiles" to "authenticated";

grant update on table "public"."permissions_profiles" to "authenticated";

grant delete on table "public"."permissions_profiles" to "service_role";

grant insert on table "public"."permissions_profiles" to "service_role";

grant references on table "public"."permissions_profiles" to "service_role";

grant select on table "public"."permissions_profiles" to "service_role";

grant trigger on table "public"."permissions_profiles" to "service_role";

grant truncate on table "public"."permissions_profiles" to "service_role";

grant update on table "public"."permissions_profiles" to "service_role";

grant delete on table "public"."platforms" to "anon";

grant insert on table "public"."platforms" to "anon";

grant references on table "public"."platforms" to "anon";

grant select on table "public"."platforms" to "anon";

grant trigger on table "public"."platforms" to "anon";

grant truncate on table "public"."platforms" to "anon";

grant update on table "public"."platforms" to "anon";

grant delete on table "public"."platforms" to "authenticated";

grant insert on table "public"."platforms" to "authenticated";

grant references on table "public"."platforms" to "authenticated";

grant select on table "public"."platforms" to "authenticated";

grant trigger on table "public"."platforms" to "authenticated";

grant truncate on table "public"."platforms" to "authenticated";

grant update on table "public"."platforms" to "authenticated";

grant delete on table "public"."platforms" to "service_role";

grant insert on table "public"."platforms" to "service_role";

grant references on table "public"."platforms" to "service_role";

grant select on table "public"."platforms" to "service_role";

grant trigger on table "public"."platforms" to "service_role";

grant truncate on table "public"."platforms" to "service_role";

grant update on table "public"."platforms" to "service_role";

grant delete on table "public"."platforms-modules" to "anon";

grant insert on table "public"."platforms-modules" to "anon";

grant references on table "public"."platforms-modules" to "anon";

grant select on table "public"."platforms-modules" to "anon";

grant trigger on table "public"."platforms-modules" to "anon";

grant truncate on table "public"."platforms-modules" to "anon";

grant update on table "public"."platforms-modules" to "anon";

grant delete on table "public"."platforms-modules" to "authenticated";

grant insert on table "public"."platforms-modules" to "authenticated";

grant references on table "public"."platforms-modules" to "authenticated";

grant select on table "public"."platforms-modules" to "authenticated";

grant trigger on table "public"."platforms-modules" to "authenticated";

grant truncate on table "public"."platforms-modules" to "authenticated";

grant update on table "public"."platforms-modules" to "authenticated";

grant delete on table "public"."platforms-modules" to "service_role";

grant insert on table "public"."platforms-modules" to "service_role";

grant references on table "public"."platforms-modules" to "service_role";

grant select on table "public"."platforms-modules" to "service_role";

grant trigger on table "public"."platforms-modules" to "service_role";

grant truncate on table "public"."platforms-modules" to "service_role";

grant update on table "public"."platforms-modules" to "service_role";

grant delete on table "public"."postal_codes" to "anon";

grant insert on table "public"."postal_codes" to "anon";

grant references on table "public"."postal_codes" to "anon";

grant select on table "public"."postal_codes" to "anon";

grant trigger on table "public"."postal_codes" to "anon";

grant truncate on table "public"."postal_codes" to "anon";

grant update on table "public"."postal_codes" to "anon";

grant delete on table "public"."postal_codes" to "authenticated";

grant insert on table "public"."postal_codes" to "authenticated";

grant references on table "public"."postal_codes" to "authenticated";

grant select on table "public"."postal_codes" to "authenticated";

grant trigger on table "public"."postal_codes" to "authenticated";

grant truncate on table "public"."postal_codes" to "authenticated";

grant update on table "public"."postal_codes" to "authenticated";

grant delete on table "public"."postal_codes" to "service_role";

grant insert on table "public"."postal_codes" to "service_role";

grant references on table "public"."postal_codes" to "service_role";

grant select on table "public"."postal_codes" to "service_role";

grant trigger on table "public"."postal_codes" to "service_role";

grant truncate on table "public"."postal_codes" to "service_role";

grant update on table "public"."postal_codes" to "service_role";

grant delete on table "public"."price_lists" to "anon";

grant insert on table "public"."price_lists" to "anon";

grant references on table "public"."price_lists" to "anon";

grant select on table "public"."price_lists" to "anon";

grant trigger on table "public"."price_lists" to "anon";

grant truncate on table "public"."price_lists" to "anon";

grant update on table "public"."price_lists" to "anon";

grant delete on table "public"."price_lists" to "authenticated";

grant insert on table "public"."price_lists" to "authenticated";

grant references on table "public"."price_lists" to "authenticated";

grant select on table "public"."price_lists" to "authenticated";

grant trigger on table "public"."price_lists" to "authenticated";

grant truncate on table "public"."price_lists" to "authenticated";

grant update on table "public"."price_lists" to "authenticated";

grant delete on table "public"."price_lists" to "service_role";

grant insert on table "public"."price_lists" to "service_role";

grant references on table "public"."price_lists" to "service_role";

grant select on table "public"."price_lists" to "service_role";

grant trigger on table "public"."price_lists" to "service_role";

grant truncate on table "public"."price_lists" to "service_role";

grant update on table "public"."price_lists" to "service_role";

grant delete on table "public"."product_categories" to "anon";

grant insert on table "public"."product_categories" to "anon";

grant references on table "public"."product_categories" to "anon";

grant select on table "public"."product_categories" to "anon";

grant trigger on table "public"."product_categories" to "anon";

grant truncate on table "public"."product_categories" to "anon";

grant update on table "public"."product_categories" to "anon";

grant delete on table "public"."product_categories" to "authenticated";

grant insert on table "public"."product_categories" to "authenticated";

grant references on table "public"."product_categories" to "authenticated";

grant select on table "public"."product_categories" to "authenticated";

grant trigger on table "public"."product_categories" to "authenticated";

grant truncate on table "public"."product_categories" to "authenticated";

grant update on table "public"."product_categories" to "authenticated";

grant delete on table "public"."product_categories" to "service_role";

grant insert on table "public"."product_categories" to "service_role";

grant references on table "public"."product_categories" to "service_role";

grant select on table "public"."product_categories" to "service_role";

grant trigger on table "public"."product_categories" to "service_role";

grant truncate on table "public"."product_categories" to "service_role";

grant update on table "public"."product_categories" to "service_role";

grant delete on table "public"."product_taxes" to "anon";

grant insert on table "public"."product_taxes" to "anon";

grant references on table "public"."product_taxes" to "anon";

grant select on table "public"."product_taxes" to "anon";

grant trigger on table "public"."product_taxes" to "anon";

grant truncate on table "public"."product_taxes" to "anon";

grant update on table "public"."product_taxes" to "anon";

grant delete on table "public"."product_taxes" to "authenticated";

grant insert on table "public"."product_taxes" to "authenticated";

grant references on table "public"."product_taxes" to "authenticated";

grant select on table "public"."product_taxes" to "authenticated";

grant trigger on table "public"."product_taxes" to "authenticated";

grant truncate on table "public"."product_taxes" to "authenticated";

grant update on table "public"."product_taxes" to "authenticated";

grant delete on table "public"."product_taxes" to "service_role";

grant insert on table "public"."product_taxes" to "service_role";

grant references on table "public"."product_taxes" to "service_role";

grant select on table "public"."product_taxes" to "service_role";

grant trigger on table "public"."product_taxes" to "service_role";

grant truncate on table "public"."product_taxes" to "service_role";

grant update on table "public"."product_taxes" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."products_price_lists" to "anon";

grant insert on table "public"."products_price_lists" to "anon";

grant references on table "public"."products_price_lists" to "anon";

grant select on table "public"."products_price_lists" to "anon";

grant trigger on table "public"."products_price_lists" to "anon";

grant truncate on table "public"."products_price_lists" to "anon";

grant update on table "public"."products_price_lists" to "anon";

grant delete on table "public"."products_price_lists" to "authenticated";

grant insert on table "public"."products_price_lists" to "authenticated";

grant references on table "public"."products_price_lists" to "authenticated";

grant select on table "public"."products_price_lists" to "authenticated";

grant trigger on table "public"."products_price_lists" to "authenticated";

grant truncate on table "public"."products_price_lists" to "authenticated";

grant update on table "public"."products_price_lists" to "authenticated";

grant delete on table "public"."products_price_lists" to "service_role";

grant insert on table "public"."products_price_lists" to "service_role";

grant references on table "public"."products_price_lists" to "service_role";

grant select on table "public"."products_price_lists" to "service_role";

grant trigger on table "public"."products_price_lists" to "service_role";

grant truncate on table "public"."products_price_lists" to "service_role";

grant update on table "public"."products_price_lists" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."sale_order_details" to "anon";

grant insert on table "public"."sale_order_details" to "anon";

grant references on table "public"."sale_order_details" to "anon";

grant select on table "public"."sale_order_details" to "anon";

grant trigger on table "public"."sale_order_details" to "anon";

grant truncate on table "public"."sale_order_details" to "anon";

grant update on table "public"."sale_order_details" to "anon";

grant delete on table "public"."sale_order_details" to "authenticated";

grant insert on table "public"."sale_order_details" to "authenticated";

grant references on table "public"."sale_order_details" to "authenticated";

grant select on table "public"."sale_order_details" to "authenticated";

grant trigger on table "public"."sale_order_details" to "authenticated";

grant truncate on table "public"."sale_order_details" to "authenticated";

grant update on table "public"."sale_order_details" to "authenticated";

grant delete on table "public"."sale_order_details" to "service_role";

grant insert on table "public"."sale_order_details" to "service_role";

grant references on table "public"."sale_order_details" to "service_role";

grant select on table "public"."sale_order_details" to "service_role";

grant trigger on table "public"."sale_order_details" to "service_role";

grant truncate on table "public"."sale_order_details" to "service_role";

grant update on table "public"."sale_order_details" to "service_role";

grant delete on table "public"."sale_order_types" to "anon";

grant insert on table "public"."sale_order_types" to "anon";

grant references on table "public"."sale_order_types" to "anon";

grant select on table "public"."sale_order_types" to "anon";

grant trigger on table "public"."sale_order_types" to "anon";

grant truncate on table "public"."sale_order_types" to "anon";

grant update on table "public"."sale_order_types" to "anon";

grant delete on table "public"."sale_order_types" to "authenticated";

grant insert on table "public"."sale_order_types" to "authenticated";

grant references on table "public"."sale_order_types" to "authenticated";

grant select on table "public"."sale_order_types" to "authenticated";

grant trigger on table "public"."sale_order_types" to "authenticated";

grant truncate on table "public"."sale_order_types" to "authenticated";

grant update on table "public"."sale_order_types" to "authenticated";

grant delete on table "public"."sale_order_types" to "service_role";

grant insert on table "public"."sale_order_types" to "service_role";

grant references on table "public"."sale_order_types" to "service_role";

grant select on table "public"."sale_order_types" to "service_role";

grant trigger on table "public"."sale_order_types" to "service_role";

grant truncate on table "public"."sale_order_types" to "service_role";

grant update on table "public"."sale_order_types" to "service_role";

grant delete on table "public"."sale_orders" to "anon";

grant insert on table "public"."sale_orders" to "anon";

grant references on table "public"."sale_orders" to "anon";

grant select on table "public"."sale_orders" to "anon";

grant trigger on table "public"."sale_orders" to "anon";

grant truncate on table "public"."sale_orders" to "anon";

grant update on table "public"."sale_orders" to "anon";

grant delete on table "public"."sale_orders" to "authenticated";

grant insert on table "public"."sale_orders" to "authenticated";

grant references on table "public"."sale_orders" to "authenticated";

grant select on table "public"."sale_orders" to "authenticated";

grant trigger on table "public"."sale_orders" to "authenticated";

grant truncate on table "public"."sale_orders" to "authenticated";

grant update on table "public"."sale_orders" to "authenticated";

grant delete on table "public"."sale_orders" to "service_role";

grant insert on table "public"."sale_orders" to "service_role";

grant references on table "public"."sale_orders" to "service_role";

grant select on table "public"."sale_orders" to "service_role";

grant trigger on table "public"."sale_orders" to "service_role";

grant truncate on table "public"."sale_orders" to "service_role";

grant update on table "public"."sale_orders" to "service_role";

grant delete on table "public"."selectable_modules" to "anon";

grant insert on table "public"."selectable_modules" to "anon";

grant references on table "public"."selectable_modules" to "anon";

grant select on table "public"."selectable_modules" to "anon";

grant trigger on table "public"."selectable_modules" to "anon";

grant truncate on table "public"."selectable_modules" to "anon";

grant update on table "public"."selectable_modules" to "anon";

grant delete on table "public"."selectable_modules" to "authenticated";

grant insert on table "public"."selectable_modules" to "authenticated";

grant references on table "public"."selectable_modules" to "authenticated";

grant select on table "public"."selectable_modules" to "authenticated";

grant trigger on table "public"."selectable_modules" to "authenticated";

grant truncate on table "public"."selectable_modules" to "authenticated";

grant update on table "public"."selectable_modules" to "authenticated";

grant delete on table "public"."selectable_modules" to "service_role";

grant insert on table "public"."selectable_modules" to "service_role";

grant references on table "public"."selectable_modules" to "service_role";

grant select on table "public"."selectable_modules" to "service_role";

grant trigger on table "public"."selectable_modules" to "service_role";

grant truncate on table "public"."selectable_modules" to "service_role";

grant update on table "public"."selectable_modules" to "service_role";

grant delete on table "public"."taxes" to "anon";

grant insert on table "public"."taxes" to "anon";

grant references on table "public"."taxes" to "anon";

grant select on table "public"."taxes" to "anon";

grant trigger on table "public"."taxes" to "anon";

grant truncate on table "public"."taxes" to "anon";

grant update on table "public"."taxes" to "anon";

grant delete on table "public"."taxes" to "authenticated";

grant insert on table "public"."taxes" to "authenticated";

grant references on table "public"."taxes" to "authenticated";

grant select on table "public"."taxes" to "authenticated";

grant trigger on table "public"."taxes" to "authenticated";

grant truncate on table "public"."taxes" to "authenticated";

grant update on table "public"."taxes" to "authenticated";

grant delete on table "public"."taxes" to "service_role";

grant insert on table "public"."taxes" to "service_role";

grant references on table "public"."taxes" to "service_role";

grant select on table "public"."taxes" to "service_role";

grant trigger on table "public"."taxes" to "service_role";

grant truncate on table "public"."taxes" to "service_role";

grant update on table "public"."taxes" to "service_role";

grant delete on table "public"."unspsc" to "anon";

grant insert on table "public"."unspsc" to "anon";

grant references on table "public"."unspsc" to "anon";

grant select on table "public"."unspsc" to "anon";

grant trigger on table "public"."unspsc" to "anon";

grant truncate on table "public"."unspsc" to "anon";

grant update on table "public"."unspsc" to "anon";

grant delete on table "public"."unspsc" to "authenticated";

grant insert on table "public"."unspsc" to "authenticated";

grant references on table "public"."unspsc" to "authenticated";

grant select on table "public"."unspsc" to "authenticated";

grant trigger on table "public"."unspsc" to "authenticated";

grant truncate on table "public"."unspsc" to "authenticated";

grant update on table "public"."unspsc" to "authenticated";

grant delete on table "public"."unspsc" to "service_role";

grant insert on table "public"."unspsc" to "service_role";

grant references on table "public"."unspsc" to "service_role";

grant select on table "public"."unspsc" to "service_role";

grant trigger on table "public"."unspsc" to "service_role";

grant truncate on table "public"."unspsc" to "service_role";

grant update on table "public"."unspsc" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."zones" to "anon";

grant insert on table "public"."zones" to "anon";

grant references on table "public"."zones" to "anon";

grant select on table "public"."zones" to "anon";

grant trigger on table "public"."zones" to "anon";

grant truncate on table "public"."zones" to "anon";

grant update on table "public"."zones" to "anon";

grant delete on table "public"."zones" to "authenticated";

grant insert on table "public"."zones" to "authenticated";

grant references on table "public"."zones" to "authenticated";

grant select on table "public"."zones" to "authenticated";

grant trigger on table "public"."zones" to "authenticated";

grant truncate on table "public"."zones" to "authenticated";

grant update on table "public"."zones" to "authenticated";

grant delete on table "public"."zones" to "service_role";

grant insert on table "public"."zones" to "service_role";

grant references on table "public"."zones" to "service_role";

grant select on table "public"."zones" to "service_role";

grant trigger on table "public"."zones" to "service_role";

grant truncate on table "public"."zones" to "service_role";

grant update on table "public"."zones" to "service_role";


  create policy "Enable insert for authenticated users only"
  on "public"."addresses"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."addresses"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."addresses"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable read access for all users"
  on "public"."appointment_status"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable delete for users based on user_id"
  on "public"."appointments"
  as permissive
  for delete
  to authenticated
using ((status_id = ( SELECT appointment_status.id
   FROM public.appointment_status
  WHERE (appointment_status.name = 'available'::text)
 LIMIT 1)));



  create policy "Enable insert for authenticated users only"
  on "public"."appointments"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."appointments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."appointments"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Enable insert for authenticated users only"
  on "public"."billing_info"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."billing_info"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."billing_info"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."companies"
  as permissive
  for insert
  to authenticated, anon
with check (true);



  create policy "Enable read access for all users"
  on "public"."companies"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Policy with table joins"
  on "public"."companies"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Enable insert for authenticated users only"
  on "public"."configurations"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."configurations"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Policy with table joins"
  on "public"."configurations"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."contact_groups"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."contact_groups"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."contact_groups"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."contacts"
  as permissive
  for insert
  to authenticated, anon
with check (true);



  create policy "Enable read access for all users"
  on "public"."contacts"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."contacts"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Enable delete for users based on user_id"
  on "public"."group_contacts"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."group_contacts"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."group_contacts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."group_contacts"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."inventories_locations"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."inventories_locations"
  as permissive
  for select
  to public
using (true);



  create policy "Policy with table joins"
  on "public"."inventories_locations"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable delete for users based on user_id"
  on "public"."inventories_movements"
  as permissive
  for delete
  to anon, authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."inventories_movements"
  as permissive
  for insert
  to authenticated, anon
with check (true);



  create policy "Enable read access for all users"
  on "public"."inventories_movements"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."inventories_movements"
  as permissive
  for update
  to anon, authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."measurements"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."measurements"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."measurements"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Allow authenticated users to create modules"
  on "public"."modules"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated users to delete modules"
  on "public"."modules"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow authenticated users to read modules"
  on "public"."modules"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated users to update modules"
  on "public"."modules"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Usuarios autenticados pueden actualizar permisos"
  on "public"."permissions"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Usuarios autenticados pueden crear permisos"
  on "public"."permissions"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Usuarios autenticados pueden eliminar permisos"
  on "public"."permissions"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Usuarios autenticados pueden leer permisos"
  on "public"."permissions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."permissions_profiles"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."permissions_profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."permissions_profiles"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."platforms"
  as permissive
  for insert
  to authenticated, anon
with check (true);



  create policy "Enable read access for all users"
  on "public"."platforms"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Policy with table joins"
  on "public"."platforms"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Enable insert for authenticated users only"
  on "public"."platforms-modules"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."platforms-modules"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."platforms-modules"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Crear código postales"
  on "public"."postal_codes"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."postal_codes"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."postal_codes"
  as permissive
  for update
  to public
using (true);



  create policy "Enable delete for users based on user_id"
  on "public"."price_lists"
  as permissive
  for delete
  to anon, authenticated
using (true);



  create policy "Enable insert for users based on user_id"
  on "public"."price_lists"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."price_lists"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Policy with table joins"
  on "public"."price_lists"
  as permissive
  for update
  to anon, authenticated
using (true);



  create policy "Usuarios pueden actualizar una categoría de productos"
  on "public"."product_categories"
  as permissive
  for update
  to public
using (true);



  create policy "Usuarios pueden consultar las categorias de los productos"
  on "public"."product_categories"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Usuarios pueden crear categorias de productos"
  on "public"."product_categories"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable delete for users based on user_id"
  on "public"."product_taxes"
  as permissive
  for delete
  to anon, authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."product_taxes"
  as permissive
  for insert
  to authenticated, anon
with check (true);



  create policy "Enable read access for all users"
  on "public"."product_taxes"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."product_taxes"
  as permissive
  for update
  to anon, authenticated
using (true);



  create policy "Enable read access for all users"
  on "public"."products"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Usuario pueda crear un nuevo producto"
  on "public"."products"
  as permissive
  for insert
  to public
with check (true);



  create policy "Usuario puede actualizar un producto"
  on "public"."products"
  as permissive
  for update
  to public
using (true);



  create policy "Enable delete for users based on user_id"
  on "public"."products_price_lists"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."products_price_lists"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."products_price_lists"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."products_price_lists"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for authenticated users"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Update profile authenticated users"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((is_write_protected = false));



  create policy "Enable insert for authenticated users only"
  on "public"."sale_order_details"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."sale_order_details"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable read access for all users"
  on "public"."sale_order_types"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."sale_orders"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."sale_orders"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."sale_orders"
  as permissive
  for update
  to authenticated, anon
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."selectable_modules"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."selectable_modules"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."selectable_modules"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Enable insert for authenticated users only"
  on "public"."taxes"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."taxes"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."taxes"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."unspsc"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."unspsc"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."unspsc"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Public users are viewable by everyone."
  on "public"."users"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can insert their own user."
  on "public"."users"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update own user."
  on "public"."users"
  as permissive
  for update
  to public
using (((( SELECT auth.uid() AS uid) = id) OR (( SELECT (users_1.profile_id)::text AS profile_id
   FROM public.users users_1
  WHERE (users_1.id = ( SELECT auth.uid() AS uid))) = '81d06bec-2dda-42d5-a22b-6a5169b0e31b'::text)));



  create policy "Crear zonas de envio"
  on "public"."zones"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."zones"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Policy with table joins"
  on "public"."zones"
  as permissive
  for update
  to public
using (true);


CREATE TRIGGER trigger_update_child_paths BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_child_paths();

CREATE TRIGGER trigger_update_permissions_code AFTER UPDATE OF code ON public.modules FOR EACH ROW WHEN ((old.code IS DISTINCT FROM new.code)) EXECUTE FUNCTION public.update_permissions_code_on_module_change();

CREATE TRIGGER trigger_create_contact_after_signup AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_contact_after_signup();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Give anon users access to JPG images in folder 1zbfv_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated, anon
using ((bucket_id = 'logo'::text));



  create policy "Give anon users access to JPG images in folder 1zbfv_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated, anon
with check ((bucket_id = 'logo'::text));



  create policy "Give anon users access to JPG images in folder 1zbfv_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated, anon
using ((bucket_id = 'logo'::text));



  create policy "Give users access to delete JPG images in folder 1zbfv_0"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated, anon
using ((bucket_id = 'logo'::text));



  create policy "Permitir insertar archivos a usuarios autenticados lfwun0_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((auth.role() = 'authenticated'::text) AND (bucket_id = 'categories'::text)));



  create policy "Permitir insertar archivos a usuarios autenticados lfwun0_1"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'categories'::text));



  create policy "Permitir insertar archivos a usuarios autenticados lfwun0_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'categories'::text));



  create policy "Permitir insertar archivos a usuarios autenticados lfwun0_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'categories'::text));



  create policy "Products 1ifhysk_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'products'::text));



  create policy "Products 1ifhysk_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'products'::text));



  create policy "Products 1ifhysk_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'products'::text));



  create policy "Products 1ifhysk_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'products'::text));



