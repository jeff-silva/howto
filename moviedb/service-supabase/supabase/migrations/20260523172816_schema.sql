create extension if not exists "vector" with schema "extensions";

alter table "public"."mdb_movie" add column "embedding" extensions.vector(384);

alter table "public"."mdb_movie" add column "embedding_text" text;

grant delete on table "public"."mdb_movie" to "postgres";

grant insert on table "public"."mdb_movie" to "postgres";

grant references on table "public"."mdb_movie" to "postgres";

grant select on table "public"."mdb_movie" to "postgres";

grant trigger on table "public"."mdb_movie" to "postgres";

grant truncate on table "public"."mdb_movie" to "postgres";

grant update on table "public"."mdb_movie" to "postgres";

grant delete on table "public"."mdb_movie_credit" to "postgres";

grant insert on table "public"."mdb_movie_credit" to "postgres";

grant references on table "public"."mdb_movie_credit" to "postgres";

grant select on table "public"."mdb_movie_credit" to "postgres";

grant trigger on table "public"."mdb_movie_credit" to "postgres";

grant truncate on table "public"."mdb_movie_credit" to "postgres";

grant update on table "public"."mdb_movie_credit" to "postgres";


