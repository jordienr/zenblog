import { Hono } from "hono";

export const createBlogsRoutes = (
  getUser: any,
  createClient: any,
  createAdminClient: any
) =>
  new Hono().get("/", async (c) => {
    try {
      // Check if the user is authenticated
      const { user } = await getUser();
      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }

      const db = createAdminClient();

      // Get blogs the user owns
      const { data: ownedBlogs, error: ownedError } = await db
        .from("blogs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (ownedError) {
        console.error("Error fetching owned blogs:", ownedError);
        return c.json(
          { error: "Failed to fetch owned blogs" },
          { status: 500 }
        );
      }

      // Get blogs the user is a member of
      const { data: memberBlogs, error: memberError } = await db
        .from("blog_members")
        .select(
          `
          blogs!inner (
            id,
            title,
            emoji,
            description,
            created_at,
            slug,
            theme,
            twitter,
            instagram,
            website
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (memberError) {
        console.error("Error fetching member blogs:", memberError);
        return c.json(
          { error: "Failed to fetch member blogs" },
          { status: 500 }
        );
      }

      // Extract blog data from the joined result
      const memberBlogsData = memberBlogs?.map((item: any) => item.blogs) || [];

      // Combine owned and member blogs, removing duplicates
      const allBlogs = [...(ownedBlogs || []), ...memberBlogsData];

      // Remove duplicates based on blog ID
      const uniqueBlogs = allBlogs.filter(
        (blog, index, self) => index === self.findIndex((b) => b.id === blog.id)
      );

      // add is_owner flag to each blog
      const blogsWithOwner = uniqueBlogs.map((blog) => ({
        ...blog,
        is_owner: blog.user_id === user.id,
      }));

      return c.json(
        {
          blogs: blogsWithOwner,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Fetch blogs error:", error);
      return c.json({ error: "Error fetching blogs" }, { status: 500 });
    }
  });
