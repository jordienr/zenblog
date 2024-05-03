(EXISTS ( SELECT 1
   FROM blogs
  WHERE ((blogs.id = blog_tags.blog_id) AND (blogs.user_id = (auth.uid())::text))))