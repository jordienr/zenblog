CREATE OR REPLACE VIEW "public"."posts_with_blog_and_subscription_status_v2" AS
 SELECT "p"."created_at",
    "p"."blog_id",
    "p"."title",
    "p"."published",
    "p"."published_at",
    "p"."content",
    "p"."updated_at",
    "p"."slug",
    "p"."id" AS "post_id",
    "p"."cover_image",
    "p"."metadata",
    "p"."deleted",
    COALESCE("array_agg"("bt"."name") FILTER (WHERE ("bt"."id" IS NOT NULL)), '{}'::"text"[]) AS "tags",
    "s"."status" AS "subscription_status"
   FROM (((("public"."posts" "p"
     LEFT JOIN "public"."blogs" "b" ON (("p"."blog_id" = "b"."id")))
     LEFT JOIN "public"."subscriptions" "s" ON (("b"."user_id" = "s"."user_id")))
     LEFT JOIN "public"."post_tags" "pt" ON (("p"."id" = "pt"."post_id")))
     LEFT JOIN "public"."blog_tags" "bt" ON (("pt"."tag_id" = "bt"."id")))
  GROUP BY "p"."created_at", "p"."blog_id", "p"."title", "p"."published", "p"."published_at", "p"."content", "p"."updated_at", "p"."slug", "p"."id", "p"."cover_image", "p"."metadata", "p"."deleted", "p"."user_id", "s"."status"
  ORDER BY "p"."created_at" DESC;

ALTER TABLE "public"."posts_with_blog_and_subscription_status_v2" OWNER TO "postgres";
GRANT ALL ON TABLE "public"."posts_with_blog_and_subscription_status_v2" TO "anon";
GRANT ALL ON TABLE "public"."posts_with_blog_and_subscription_status_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_with_blog_and_subscription_status_v2" TO "service_role";
