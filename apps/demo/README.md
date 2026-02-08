# Zenblog API Demo

This is a demo Next.js application that showcases the Zenblog API endpoints using the `zenblog` npm package.

## Features

- **Posts List**: Browse all posts with pagination and filtering by category, tags, or author
- **Individual Post**: View full post content with HTML rendering
- **Categories**: Browse all available categories
- **Tags**: Browse all available tags
- **Authors**: View all authors and their posts

## Setup

1. Make sure you have the API server running on `localhost:8082`
2. Install dependencies from the root:
   ```bash
   npm install
   ```
3. Build the zenblog package:
   ```bash
   npm run build:zenblog
   ```
4. Update `.env.local` with your blog ID (already configured for testing)
5. Run the demo app:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3001`

## Configuration

The app is configured via environment variables in `.env.local`:

- `NEXT_PUBLIC_BLOG_ID`: Default Zenblog blog ID (optional, defaults to `53a970ef-cc74-40ac-ac53-c322cd4848cb`)
- `NEXT_PUBLIC_API_URL`: The API URL (defaults to `http://localhost:8082/api/public` for local testing)

### Changing Blog ID at Runtime

You can test different blog IDs without changing the code:

1. Click the "Change" button in the top right corner of the navigation
2. Enter a new blog ID
3. Click "Apply" to use the new blog ID
4. Click "Reset" to go back to the default blog ID

The blog ID is persisted in the URL as a query parameter (`?blogId=...`), so you can bookmark or share links with specific blog IDs.

## Pages

- `/` - Home page with links to all sections
- `/posts` - List of all posts with filtering options
- `/posts/[slug]` - Individual post page
- `/categories` - List of all categories
- `/tags` - List of all tags
- `/authors` - List of all authors
- `/authors/[slug]` - Individual author page with their posts

## API Endpoints Tested

This demo exercises all public API endpoints:

- `GET /blogs/:blogId/posts` - List posts (with filtering)
- `GET /blogs/:blogId/posts/:slug` - Get single post
- `GET /blogs/:blogId/categories` - List categories
- `GET /blogs/:blogId/tags` - List tags
- `GET /blogs/:blogId/authors` - List authors
- `GET /blogs/:blogId/authors/:slug` - Get single author
