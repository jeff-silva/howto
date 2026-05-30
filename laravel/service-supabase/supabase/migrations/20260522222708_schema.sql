create extension if not exists "pgjwt" with schema "extensions";


  create table "public"."mdb_movie" (
    "id" integer not null,
    "title" text not null,
    "original_title" text,
    "original_language" character varying(10),
    "overview" text,
    "tagline" text,
    "status" character varying(50),
    "release_date" date,
    "runtime" numeric,
    "budget" bigint,
    "revenue" bigint,
    "popularity" double precision,
    "vote_average" numeric(3,1),
    "vote_count" integer,
    "homepage" text,
    "genres" jsonb,
    "keywords" jsonb,
    "production_companies" jsonb,
    "production_countries" jsonb,
    "spoken_languages" jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );



  create table "public"."mdb_movie_credit" (
    "movie_id" integer not null,
    "title" text,
    "cast" jsonb,
    "crew" jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


CREATE INDEX idx_mdb_movie_credit_cast ON public.mdb_movie_credit USING gin ("cast");

CREATE INDEX idx_mdb_movie_genres ON public.mdb_movie USING gin (genres);

CREATE INDEX idx_mdb_movie_keywords ON public.mdb_movie USING gin (keywords);

CREATE UNIQUE INDEX mdb_movie_credit_pkey ON public.mdb_movie_credit USING btree (movie_id);

CREATE UNIQUE INDEX mdb_movie_pkey ON public.mdb_movie USING btree (id);

alter table "public"."mdb_movie" add constraint "mdb_movie_pkey" PRIMARY KEY using index "mdb_movie_pkey";

alter table "public"."mdb_movie_credit" add constraint "mdb_movie_credit_pkey" PRIMARY KEY using index "mdb_movie_credit_pkey";

alter table "public"."mdb_movie_credit" add constraint "mdb_movie_credit_movie_id_fkey" FOREIGN KEY (movie_id) REFERENCES public.mdb_movie(id) ON DELETE CASCADE not valid;

alter table "public"."mdb_movie_credit" validate constraint "mdb_movie_credit_movie_id_fkey";

grant delete on table "public"."mdb_movie" to "anon";

grant insert on table "public"."mdb_movie" to "anon";

grant references on table "public"."mdb_movie" to "anon";

grant select on table "public"."mdb_movie" to "anon";

grant trigger on table "public"."mdb_movie" to "anon";

grant truncate on table "public"."mdb_movie" to "anon";

grant update on table "public"."mdb_movie" to "anon";

grant delete on table "public"."mdb_movie" to "authenticated";

grant insert on table "public"."mdb_movie" to "authenticated";

grant references on table "public"."mdb_movie" to "authenticated";

grant select on table "public"."mdb_movie" to "authenticated";

grant trigger on table "public"."mdb_movie" to "authenticated";

grant truncate on table "public"."mdb_movie" to "authenticated";

grant update on table "public"."mdb_movie" to "authenticated";

grant delete on table "public"."mdb_movie" to "postgres";

grant insert on table "public"."mdb_movie" to "postgres";

grant references on table "public"."mdb_movie" to "postgres";

grant select on table "public"."mdb_movie" to "postgres";

grant trigger on table "public"."mdb_movie" to "postgres";

grant truncate on table "public"."mdb_movie" to "postgres";

grant update on table "public"."mdb_movie" to "postgres";

grant delete on table "public"."mdb_movie" to "service_role";

grant insert on table "public"."mdb_movie" to "service_role";

grant references on table "public"."mdb_movie" to "service_role";

grant select on table "public"."mdb_movie" to "service_role";

grant trigger on table "public"."mdb_movie" to "service_role";

grant truncate on table "public"."mdb_movie" to "service_role";

grant update on table "public"."mdb_movie" to "service_role";

grant delete on table "public"."mdb_movie_credit" to "anon";

grant insert on table "public"."mdb_movie_credit" to "anon";

grant references on table "public"."mdb_movie_credit" to "anon";

grant select on table "public"."mdb_movie_credit" to "anon";

grant trigger on table "public"."mdb_movie_credit" to "anon";

grant truncate on table "public"."mdb_movie_credit" to "anon";

grant update on table "public"."mdb_movie_credit" to "anon";

grant delete on table "public"."mdb_movie_credit" to "authenticated";

grant insert on table "public"."mdb_movie_credit" to "authenticated";

grant references on table "public"."mdb_movie_credit" to "authenticated";

grant select on table "public"."mdb_movie_credit" to "authenticated";

grant trigger on table "public"."mdb_movie_credit" to "authenticated";

grant truncate on table "public"."mdb_movie_credit" to "authenticated";

grant update on table "public"."mdb_movie_credit" to "authenticated";

grant delete on table "public"."mdb_movie_credit" to "postgres";

grant insert on table "public"."mdb_movie_credit" to "postgres";

grant references on table "public"."mdb_movie_credit" to "postgres";

grant select on table "public"."mdb_movie_credit" to "postgres";

grant trigger on table "public"."mdb_movie_credit" to "postgres";

grant truncate on table "public"."mdb_movie_credit" to "postgres";

grant update on table "public"."mdb_movie_credit" to "postgres";

grant delete on table "public"."mdb_movie_credit" to "service_role";

grant insert on table "public"."mdb_movie_credit" to "service_role";

grant references on table "public"."mdb_movie_credit" to "service_role";

grant select on table "public"."mdb_movie_credit" to "service_role";

grant trigger on table "public"."mdb_movie_credit" to "service_role";

grant truncate on table "public"."mdb_movie_credit" to "service_role";

grant update on table "public"."mdb_movie_credit" to "service_role";


