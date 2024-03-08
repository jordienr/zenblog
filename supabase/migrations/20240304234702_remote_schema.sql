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
    t.owner_id,
    s.status AS subscription_status
   FROM (((((posts p
     LEFT JOIN blogs b ON ((p.blog_id = b.id)))
     LEFT JOIN teams t ON ((b.user_id = t.owner_id)))
     LEFT JOIN subscriptions s ON ((t.owner_id = s.user_id)))
     LEFT JOIN post_tags pt ON ((p.id = pt.post_id)))
     LEFT JOIN blog_tags bt ON ((pt.tag_id = bt.id)))
  GROUP BY p.created_at, p.blog_id, p.title, p.published, p.content, p.updated_at, p.slug, p.id, p.cover_image, p.metadata, p.deleted, p.user_id, t.owner_id, s.status
  ORDER BY p.created_at DESC;



