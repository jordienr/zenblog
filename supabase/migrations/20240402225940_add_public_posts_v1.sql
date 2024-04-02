alter table "public"."blogs" drop column "public_id";

alter table "public"."blogs" add column "slug" text;

CREATE UNIQUE INDEX blogs_slug_key ON public.blogs USING btree (slug);

alter table "public"."blogs" add constraint "blogs_slug_key" UNIQUE using index "blogs_slug_key";

create or replace view "public"."public_posts_v1" as  SELECT p.created_at,
    p.blog_id,
    p.title,
    p.published,
    p.published_at,
    p.content,
    p.updated_at,
    p.slug,
    p.id AS post_id,
    p.cover_image,
    p.metadata,
    p.deleted,
    COALESCE(array_agg(bt.name) FILTER (WHERE (bt.id IS NOT NULL)), '{}'::text[]) AS tags,
    s.status AS subscription_status,
    b.slug AS blog_slug
   FROM ((((posts p
     LEFT JOIN blogs b ON ((p.blog_id = b.id)))
     LEFT JOIN subscriptions s ON ((b.user_id = s.user_id)))
     LEFT JOIN post_tags pt ON ((p.id = pt.post_id)))
     LEFT JOIN blog_tags bt ON ((pt.tag_id = bt.id)))
  GROUP BY p.created_at, p.blog_id, p.title, p.published, p.published_at, p.content, p.updated_at, p.slug, p.id, p.cover_image, p.metadata, p.deleted, p.user_id, s.status, b.slug
  ORDER BY p.created_at DESC;


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


create or replace view "public"."posts_with_blog_and_subscription_status_v2" as  SELECT p.created_at,
    p.blog_id,
    p.title,
    p.published,
    p.published_at,
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
  GROUP BY p.created_at, p.blog_id, p.title, p.published, p.published_at, p.content, p.updated_at, p.slug, p.id, p.cover_image, p.metadata, p.deleted, p.user_id, s.status
  ORDER BY p.created_at DESC;



