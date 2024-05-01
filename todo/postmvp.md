# POST LAUNCH

## Ideas

- [] Allow to fetch list of posts with content.

```typescript
const posts = await client.posts.list({ withContent: true, limit: 10 });
```

- [] Allow draft/publish from post list.
- [] Allow copy slug from post list.
- [] Allow users to add default metadata for posts in a blog.
- [] Add PolyScale cache to Supabase for faster queries?
- [] Featured Images
- [] Excerpts
- [] Authors
- [] Analytics
- [] Pin blogs to the top of the list
- [] Redesign settings page to be similar to Plausible
- [] Use a generic on createClient to pass the custom metadata
- [] Add files to custom metadata
- [] Allow "undo" for destructive actions - [] Delete post - [] Delete blog
- Allow users to see their trash and restore items from the trash.
- [] Make layout work on mobile
- [] Make inputs not zoom in on mobile
- [] Grace period for expired subscriptions
- [] Auto generate abstract with AI
- [] Auto generate promotional tweet for a post with AI. With a short description of what the post is about.

## Teams

- [] When a user logs in, a team is created for them.
- [] Billing is per team.
- [] Blogs are owned by a team.

## Blog themes

- [] Ask theme devs if they mind me porting their themes to Zenblog (with proper attribution)
- [] https://andersnoren.se/

## Hosted blogs

- [] Let zenblog host your blog for you
- [] Custom domain support
  - vercel: (https://github.com/orgs/vercel/discussions/31)
  - cloudflare: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/create-custom-hostnames/
- [] Hosted blog themes

# Analytics

- [] Add analytics to blogs

## Self hosting

- [] Add documentation for self hosting
- [] Self hosting license

## Editor Themes

- [] Pick your editor theme, serif, sans-serif, monospace.

## SEO?

- [] List what SEO metadata is needed for posts
- [] Add SEO metadata to blogs?

## Invitations

Users can invite other users to join their blog. Perfect for teams and guest authors.

- [] Create invitation
- [] Accept invitation
- [] Reject invitation
- [] Delete invitation

## Members

- [] Send invitation email to join blog
- [] Add members to a blog
- [] Remove members from a blog
- [] As a member, view all posts in a blog
- [] As a member, create a post in a blog
- [] As a member, edit a post in a blog
- [] As a member, delete a post in a blog

## User Feedback

- [] Custom Supabase URL for API client
