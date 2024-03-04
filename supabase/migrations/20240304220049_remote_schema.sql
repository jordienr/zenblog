drop policy "delete_categories_policy" on "public"."blog_tags";

drop policy "insert_categories_policy" on "public"."blog_tags";

drop policy "update_categories_policy" on "public"."blog_tags";

drop policy "owners of a blog can create invitations" on "public"."invitations";

drop policy "owners of a blog can delete invitations" on "public"."invitations";

drop policy "owners of the blog can see invitations" on "public"."invitations";

drop policy "Enable insert for authenticated users only" on "public"."post_tags";

drop policy "Enable read access for all users" on "public"."post_tags";

drop policy "delete_policy" on "public"."post_tags";

drop policy "users can crud their blogs" on "public"."blogs";

drop policy "update_post_tags" on "public"."post_tags";

drop policy "update_posts" on "public"."posts";

revoke delete on table "public"."invitations" from "anon";

revoke insert on table "public"."invitations" from "anon";

revoke references on table "public"."invitations" from "anon";

revoke select on table "public"."invitations" from "anon";

revoke trigger on table "public"."invitations" from "anon";

revoke truncate on table "public"."invitations" from "anon";

revoke update on table "public"."invitations" from "anon";

revoke delete on table "public"."invitations" from "authenticated";

revoke insert on table "public"."invitations" from "authenticated";

revoke references on table "public"."invitations" from "authenticated";

revoke select on table "public"."invitations" from "authenticated";

revoke trigger on table "public"."invitations" from "authenticated";

revoke truncate on table "public"."invitations" from "authenticated";

revoke update on table "public"."invitations" from "authenticated";

revoke delete on table "public"."invitations" from "service_role";

revoke insert on table "public"."invitations" from "service_role";

revoke references on table "public"."invitations" from "service_role";

revoke select on table "public"."invitations" from "service_role";

revoke trigger on table "public"."invitations" from "service_role";

revoke truncate on table "public"."invitations" from "service_role";

revoke update on table "public"."invitations" from "service_role";

alter table "public"."invitations" drop constraint "invitations_blog_id_fkey";

alter table "public"."posts" drop constraint "unique_slug_per_user_post_constraint";

drop view if exists "public"."posts_with_tags";

alter table "public"."invitations" drop constraint "invitations_pkey";

drop index if exists "public"."invitations_pkey";

drop index if exists "public"."unique_slug_per_user_post_constraint";

drop table "public"."invitations";

alter table "public"."blogs" alter column "user_id" drop default;

alter table "public"."blogs" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."posts" drop column "deprecated_user_id";

CREATE UNIQUE INDEX unique_slug_per_user_blog_constraint ON public.posts USING btree (slug, user_id, blog_id);

alter table "public"."blogs" add constraint "fk_blogs_users" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."blogs" validate constraint "fk_blogs_users";

alter table "public"."posts" add constraint "public_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."posts" validate constraint "public_posts_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_blog_owner(blog_id uuid, given_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.blogs
        WHERE id = blog_id AND user_id = given_user_id
    );
END;
$function$
;

create or replace view "public"."posts_with_tags" as  SELECT p.created_at,
    p.blog_id,
    p.title,
    p.published,
    p.content,
    p.updated_at,
    p.slug,
    p.id AS post_id,
    p.cover_image,
    p.metadata,
    p.deleted,
    COALESCE(array_agg(bt.name) FILTER (WHERE (bt.id IS NOT NULL)), '{}'::text[]) AS tags
   FROM ((posts p
     LEFT JOIN post_tags pt ON ((p.id = pt.post_id)))
     LEFT JOIN blog_tags bt ON ((pt.tag_id = bt.id)))
  GROUP BY p.created_at, p.blog_id, p.title, p.published, p.content, p.updated_at, p.slug, p.id, p.cover_image, p.metadata, p.deleted, p.user_id
  ORDER BY p.created_at DESC;


create policy "delete_tags"
on "public"."blog_tags"
as permissive
for delete
to public
using (is_blog_owner(blog_id, auth.uid()));


create policy "insert_tags"
on "public"."blog_tags"
as permissive
for insert
to public
with check (is_blog_owner(blog_id, auth.uid()));


create policy "update_tags"
on "public"."blog_tags"
as permissive
for update
to public
using (is_blog_owner(blog_id, auth.uid()));


create policy "delete_post_tag"
on "public"."post_tags"
as permissive
for delete
to authenticated
using (is_blog_owner(blog_id, auth.uid()));


create policy "insert_post_tag"
on "public"."post_tags"
as permissive
for insert
to authenticated
with check (is_blog_owner(blog_id, auth.uid()));


create policy "read_post_tags"
on "public"."post_tags"
as permissive
for select
to public
using (true);


create policy "users can crud their blogs"
on "public"."blogs"
as permissive
for all
to authenticated
using ((auth.uid() = user_id));


create policy "update_post_tags"
on "public"."post_tags"
as permissive
for update
to authenticated
using (is_blog_owner(blog_id, auth.uid()))
with check (true);


create policy "update_posts"
on "public"."posts"
as permissive
for update
to authenticated
using (is_blog_owner(blog_id, auth.uid()));



