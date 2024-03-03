drop policy "insert_posts" on "public"."posts";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_blog_owner(blog_id uuid, given_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.blogs
        WHERE id = blog_id AND user_id = given_user_id::text
    );
END;
$function$
;

create policy "authed_read_posts"
on "public"."posts"
as permissive
for select
to authenticated
using (is_blog_owner(blog_id, auth.uid()));


create policy "insert_posts"
on "public"."posts"
as permissive
for insert
to authenticated
with check (is_blog_owner(blog_id, auth.uid()));



