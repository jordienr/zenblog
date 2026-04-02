import { and, arrayOverlaps, desc, eq, inArray } from "drizzle-orm";
import { authors, categories, postsV10, tagUsageCountV2, tags } from "./schema";
import type { DbClient } from "./client";

export type ListPostsInput = {
  blogId: string;
  offset: number;
  limit: number;
  category?: string;
  tags?: string[];
  author?: string;
};

export async function listPublicPosts(db: DbClient, input: ListPostsInput) {
  const authorRows = await db
    .select({
      id: authors.id,
      slug: authors.slug,
      name: authors.name,
      image_url: authors.imageUrl,
      bio: authors.bio,
      website: authors.website,
      twitter: authors.twitter,
    })
    .from(authors)
    .where(eq(authors.blogId, input.blogId));

  const blogTags = await db
    .select({
      name: tags.name,
      slug: tags.slug,
    })
    .from(tags)
    .where(eq(tags.blogId, input.blogId));

  const authorFilter = input.author
    ? authorRows.find((author) => author.slug === input.author)
    : undefined;

  const filters = [
    eq(postsV10.blogId, input.blogId),
    eq(postsV10.published, true),
    eq(postsV10.deleted, false),
    input.category ? eq(postsV10.categorySlug, input.category) : undefined,
    input.tags?.length ? arrayOverlaps(postsV10.tags, input.tags) : undefined,
    authorFilter ? arrayOverlaps(postsV10.authors, [authorFilter.id]) : undefined,
  ].filter(Boolean);

  const rows = await db
    .select()
    .from(postsV10)
    .where(and(...(filters as Parameters<typeof and>)))
    .orderBy(desc(postsV10.publishedAt))
    .offset(input.offset)
    .limit(input.limit);

  return rows.map((post) => ({
    title: post.title || "",
    slug: post.slug || "",
    published_at: post.publishedAt?.toISOString() || "",
    excerpt: post.excerpt || "",
    cover_image: post.coverImage || "",
    category:
      post.categoryName && post.categorySlug
        ? {
            name: post.categoryName,
            slug: post.categorySlug,
          }
        : null,
    tags: blogTags.filter((tag) => post.tags?.includes(tag.slug)),
    authors: authorRows
      .filter((author) => post.authors?.includes(author.id))
      .map((author) => ({
        name: author.name,
        slug: author.slug,
        image_url: author.image_url || "",
        bio: author.bio || undefined,
        website_url: author.website || undefined,
        twitter_url: author.twitter || undefined,
      })),
  }));
}

export async function getPublicPostBySlug(
  db: DbClient,
  input: { blogId: string; slug: string }
) {
  const rows = await db
    .select()
    .from(postsV10)
    .where(and(eq(postsV10.blogId, input.blogId), eq(postsV10.slug, input.slug)))
    .limit(1);

  const post = rows[0];

  if (!post) {
    return null;
  }

  const [postTagsRows, authorRows] = await Promise.all([
    post.tags?.length
      ? db
          .select({ name: tags.name, slug: tags.slug })
          .from(tags)
          .where(and(eq(tags.blogId, input.blogId), inArray(tags.slug, post.tags)))
      : Promise.resolve([]),
    post.authors?.length
      ? db
          .select({
            id: authors.id,
            slug: authors.slug,
            name: authors.name,
            image_url: authors.imageUrl,
            bio: authors.bio,
            website: authors.website,
            twitter: authors.twitter,
          })
          .from(authors)
          .where(and(eq(authors.blogId, input.blogId), inArray(authors.id, post.authors)))
      : Promise.resolve([]),
  ]);

  return {
    title: post.title || "",
    slug: post.slug || "",
    published_at: post.publishedAt?.toISOString() || "",
    excerpt: post.excerpt || "",
    cover_image: post.coverImage || "",
    category:
      post.categoryName && post.categorySlug
        ? {
            name: post.categoryName,
            slug: post.categorySlug,
          }
        : null,
    tags: postTagsRows,
    authors: authorRows.map((author) => ({
      name: author.name,
      slug: author.slug,
      image_url: author.image_url || "",
      bio: author.bio || undefined,
      website_url: author.website || undefined,
      twitter_url: author.twitter || undefined,
    })),
    html_content: post.htmlContent || "",
  };
}

export async function listPublicCategories(
  db: DbClient,
  input: { blogId: string; offset: number; limit: number }
) {
  return db
    .select({ name: categories.name, slug: categories.slug })
    .from(categories)
    .where(eq(categories.blogId, input.blogId))
    .offset(input.offset)
    .limit(input.limit);
}

export async function listPublicTags(
  db: DbClient,
  input: { blogId: string; offset: number; limit: number }
) {
  return db
    .select({ name: tags.name, slug: tags.slug })
    .from(tags)
    .where(eq(tags.blogId, input.blogId))
    .offset(input.offset)
    .limit(input.limit);
}

export async function listPublicAuthors(
  db: DbClient,
  input: { blogId: string; offset: number; limit: number }
) {
  const rows = await db
    .select({
      name: authors.name,
      slug: authors.slug,
      image_url: authors.imageUrl,
      twitter: authors.twitter,
      website: authors.website,
      bio: authors.bio,
    })
    .from(authors)
    .where(eq(authors.blogId, input.blogId))
    .offset(input.offset)
    .limit(input.limit);

  return rows.map((author) => ({
    ...author,
    twitter_url: author.twitter || undefined,
    website_url: author.website || undefined,
  }));
}

export async function getPublicAuthorBySlug(
  db: DbClient,
  input: { blogId: string; slug: string }
) {
  const rows = await db
    .select({
      name: authors.name,
      slug: authors.slug,
      image_url: authors.imageUrl,
      twitter: authors.twitter,
      website: authors.website,
      bio: authors.bio,
    })
    .from(authors)
    .where(and(eq(authors.blogId, input.blogId), eq(authors.slug, input.slug)))
    .limit(1);

  const author = rows[0];

  if (!author) {
    return null;
  }

  return {
    ...author,
    image_url: author.image_url || "",
    bio: author.bio || "",
    website: author.website || "",
    twitter: author.twitter || "",
    website_url: author.website || undefined,
    twitter_url: author.twitter || undefined,
  };
}

export async function getTagUsageCounts(
  db: DbClient,
  input: { blogId: string }
) {
  return db
    .select()
    .from(tagUsageCountV2)
    .where(eq(tagUsageCountV2.blogId, input.blogId));
}
