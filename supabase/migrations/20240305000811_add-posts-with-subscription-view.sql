alter table "public"."blogs" drop constraint "fk_blogs_users";

drop view if exists "public"."posts_with_blog_and_subscription_status";

alter table "public"."blogs" alter column "user_id" set default auth.uid();

alter table "public"."blogs" add constraint "blogs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."blogs" validate constraint "blogs_user_id_fkey";

create or replace view "public"."posts_with_blog_and_subscription_status" as  SELECT p.created_at,
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
    COALESCE(array_agg(bt.name) FILTER (WHERE (bt.id IS NOT NULL)), '{}'::text[]) AS tags,
    s.status AS subscription_status
   FROM ((((posts p
     LEFT JOIN blogs b ON ((p.blog_id = b.id)))
     LEFT JOIN subscriptions s ON ((b.user_id = s.user_id)))
     LEFT JOIN post_tags pt ON ((p.id = pt.post_id)))
     LEFT JOIN blog_tags bt ON ((pt.tag_id = bt.id)))
  GROUP BY p.created_at, p.blog_id, p.title, p.published, p.content, p.updated_at, p.slug, p.id, p.cover_image, p.metadata, p.deleted, p.user_id, s.status
  ORDER BY p.created_at DESC;



