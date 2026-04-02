import { and, asc, count, desc, eq } from "drizzle-orm";
import type { DbClient } from "./client";
import {
  authors,
  blogs,
  categories,
  categoryPostCount,
  postAuthors,
  tags,
  tagUsageCountV2,
} from "./schema";

export async function listUserBlogs(db: DbClient, userId: string) {
  return db
    .select({
      id: blogs.id,
      title: blogs.title,
      emoji: blogs.emoji,
      description: blogs.description,
      created_at: blogs.createdAt,
      slug: blogs.slug,
      theme: blogs.theme,
      twitter: blogs.twitter,
      instagram: blogs.instagram,
      website: blogs.website,
      access_token: blogs.accessToken,
    })
    .from(blogs)
    .where(eq(blogs.userId, userId))
    .orderBy(asc(blogs.createdAt));
}

export async function getUserBlogById(
  db: DbClient,
  input: { userId: string; blogId: string }
) {
  const rows = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      emoji: blogs.emoji,
      description: blogs.description,
      created_at: blogs.createdAt,
      slug: blogs.slug,
      theme: blogs.theme,
      twitter: blogs.twitter,
      instagram: blogs.instagram,
      website: blogs.website,
      access_token: blogs.accessToken,
    })
    .from(blogs)
    .where(and(eq(blogs.id, input.blogId), eq(blogs.userId, input.userId)))
    .limit(1);

  return rows[0] || null;
}

export async function createUserBlog(
  db: DbClient,
  input: {
    userId: string;
    title: string;
    description: string;
    emoji: string;
  }
) {
  const rows = await db
    .insert(blogs)
    .values({
      userId: input.userId,
      title: input.title,
      description: input.description,
      emoji: input.emoji,
    })
    .returning({
      id: blogs.id,
      title: blogs.title,
      emoji: blogs.emoji,
      description: blogs.description,
      created_at: blogs.createdAt,
      slug: blogs.slug,
      theme: blogs.theme,
      twitter: blogs.twitter,
      instagram: blogs.instagram,
      website: blogs.website,
      access_token: blogs.accessToken,
    });

  return rows[0] || null;
}

export async function updateUserBlog(
  db: DbClient,
  input: {
    userId: string;
    blogId: string;
    title?: string;
    description?: string;
    emoji?: string;
    theme?: string;
    accessToken?: string;
  }
) {
  const rows = await db
    .update(blogs)
    .set({
      title: input.title,
      description: input.description,
      emoji: input.emoji,
      theme: input.theme,
      accessToken: input.accessToken,
      updatedAt: new Date(),
    })
    .where(and(eq(blogs.id, input.blogId), eq(blogs.userId, input.userId)))
    .returning({
      id: blogs.id,
      title: blogs.title,
      emoji: blogs.emoji,
      description: blogs.description,
      created_at: blogs.createdAt,
      slug: blogs.slug,
      theme: blogs.theme,
      twitter: blogs.twitter,
      instagram: blogs.instagram,
      website: blogs.website,
      access_token: blogs.accessToken,
    });

  return rows[0] || null;
}

export async function deleteUserBlog(
  db: DbClient,
  input: { userId: string; blogId: string }
) {
  const rows = await db
    .delete(blogs)
    .where(and(eq(blogs.id, input.blogId), eq(blogs.userId, input.userId)))
    .returning({ id: blogs.id });

  return rows[0] || null;
}

export async function listBlogCategories(db: DbClient, blogId: string) {
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      created_at: categories.createdAt,
    })
    .from(categories)
    .where(eq(categories.blogId, blogId))
    .orderBy(asc(categories.createdAt));
}

export async function listBlogCategoriesWithPostCount(
  db: DbClient,
  blogId: string
) {
  return db
    .select()
    .from(categoryPostCount)
    .where(eq(categoryPostCount.blogId, blogId))
    .orderBy(desc(categoryPostCount.postCount));
}

export async function createBlogCategory(
  db: DbClient,
  input: { blogId: string; name: string; slug: string }
) {
  const rows = await db
    .insert(categories)
    .values({
      blogId: input.blogId,
      name: input.name,
      slug: input.slug,
    })
    .returning();

  return rows[0] || null;
}

export async function updateBlogCategory(
  db: DbClient,
  input: { blogId: string; categoryId: number; name: string; slug: string }
) {
  const rows = await db
    .update(categories)
    .set({
      name: input.name,
      slug: input.slug,
    })
    .where(and(eq(categories.blogId, input.blogId), eq(categories.id, input.categoryId)))
    .returning();

  return rows[0] || null;
}

export async function deleteBlogCategory(
  db: DbClient,
  input: { blogId: string; categoryId: number }
) {
  const rows = await db
    .delete(categories)
    .where(and(eq(categories.blogId, input.blogId), eq(categories.id, input.categoryId)))
    .returning({ id: categories.id });

  return rows[0] || null;
}

export async function listBlogTags(db: DbClient, blogId: string) {
  return db
    .select()
    .from(tags)
    .where(eq(tags.blogId, blogId))
    .orderBy(asc(tags.createdAt));
}

export async function listBlogTagUsageCounts(db: DbClient, blogId: string) {
  return db
    .select()
    .from(tagUsageCountV2)
    .where(eq(tagUsageCountV2.blogId, blogId))
    .orderBy(desc(tagUsageCountV2.postCount));
}

export async function createBlogTag(
  db: DbClient,
  input: { blogId: string; name: string; slug: string }
) {
  const rows = await db
    .insert(tags)
    .values({
      blogId: input.blogId,
      name: input.name,
      slug: input.slug,
    })
    .returning();

  return rows[0] || null;
}

export async function updateBlogTag(
  db: DbClient,
  input: { blogId: string; tagId: string; name: string; slug: string }
) {
  const rows = await db
    .update(tags)
    .set({
      name: input.name,
      slug: input.slug,
      updatedAt: new Date(),
    })
    .where(and(eq(tags.blogId, input.blogId), eq(tags.id, input.tagId)))
    .returning();

  return rows[0] || null;
}

export async function deleteBlogTag(
  db: DbClient,
  input: { blogId: string; tagId: string }
) {
  const rows = await db
    .delete(tags)
    .where(and(eq(tags.blogId, input.blogId), eq(tags.id, input.tagId)))
    .returning({ id: tags.id });

  return rows[0] || null;
}

export async function countBlogCategories(db: DbClient, blogId: string) {
  const rows = await db
    .select({ value: count() })
    .from(categories)
    .where(eq(categories.blogId, blogId));

  return rows[0]?.value || 0;
}

export async function countBlogTags(db: DbClient, blogId: string) {
  const rows = await db
    .select({ value: count() })
    .from(tags)
    .where(eq(tags.blogId, blogId));

  return rows[0]?.value || 0;
}

export async function listBlogAuthors(db: DbClient, blogId: string) {
  return db
    .select({
      id: authors.id,
      slug: authors.slug,
      name: authors.name,
      created_at: authors.createdAt,
      bio: authors.bio,
      twitter: authors.twitter,
      website: authors.website,
      image_url: authors.imageUrl,
    })
    .from(authors)
    .where(eq(authors.blogId, blogId))
    .orderBy(asc(authors.createdAt));
}

export async function deleteBlogAuthor(
  db: DbClient,
  input: { blogId: string; authorId: number }
) {
  const rows = await db
    .delete(authors)
    .where(and(eq(authors.blogId, input.blogId), eq(authors.id, input.authorId)))
    .returning({ id: authors.id });

  return rows[0] || null;
}

export async function listPostAuthors(
  db: DbClient,
  input: { blogId: string; postId: string }
) {
  const rows = await db
    .select({
      id: postAuthors.id,
      post_id: postAuthors.postId,
      author_id: postAuthors.authorId,
      author_name: authors.name,
      author_slug: authors.slug,
      author_image_url: authors.imageUrl,
    })
    .from(postAuthors)
    .innerJoin(authors, eq(postAuthors.authorId, authors.id))
    .where(and(eq(postAuthors.blogId, input.blogId), eq(postAuthors.postId, input.postId)));

  return rows.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    author: {
      name: row.author_name,
      slug: row.author_slug,
      image_url: row.author_image_url,
    },
  }));
}

export async function addPostAuthor(
  db: DbClient,
  input: { blogId: string; postId: string; authorId: number }
) {
  const rows = await db
    .insert(postAuthors)
    .values({
      blogId: input.blogId,
      postId: input.postId,
      authorId: input.authorId,
    })
    .returning();

  return rows[0] || null;
}

export async function removePostAuthor(
  db: DbClient,
  input: { postId: string; authorId: number }
) {
  const rows = await db
    .delete(postAuthors)
    .where(and(eq(postAuthors.postId, input.postId), eq(postAuthors.authorId, input.authorId)))
    .returning({ id: postAuthors.id });

  return rows[0] || null;
}
