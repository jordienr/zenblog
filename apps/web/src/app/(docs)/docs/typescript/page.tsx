import { CodeBlockComponent } from "@/components/code-block";
import { DocsPageLayout } from "app/ui/docs-page-layout";

export default function Typescript() {
  return (
    <DocsPageLayout
      title="Typescript"
      description="Create typed components for your content easily with Zenblog's types."
      tocItems={[
        { title: "Importing types", href: "importing-types" },
        { title: "Post type", href: "post-type" },
        { title: "PostWithContent type", href: "post-with-content-type" },
        { title: "Author type", href: "author-type" },
        { title: "Category type", href: "category-type" },
        { title: "Tag type", href: "tag-type" },
      ]}
    >
      <div className="prose mt-8 space-y-8">
        <section>
          <h2 id="importing-types">Importing types</h2>
          <p>
            Zenblog exports types for all the data returned from the API. You
            can use them to create typed components for your content. Import
            them from the <code>zenblog/types</code> after installing the
            package with <code>npm install zenblog</code>.
          </p>
          <CodeBlockComponent filename="lib/zenblog.ts" language="tsx">
            {`import { Post, PostWithContent, Author, Category, Tag } from "zenblog/types";`}
          </CodeBlockComponent>
        </section>

        <section>
          <h2 id="post-type">Post type</h2>
          <p>Posts without html_content property. Used to list posts.</p>
          <CodeBlockComponent filename="lib/zenblog.ts" language="tsx">
            {`export type Post = {
  title: string;
  slug: string;
  published_at: string;
  cover_image?: string;
  excerpt?: string;
  tags: Tag[];
  category: Category | null;
  authors: Author[];
};`}
          </CodeBlockComponent>
        </section>

        <section>
          <h2 id="post-with-content-type">PostWithContent type</h2>
          <p>Posts with html_content property. Used to render a post.</p>
          <CodeBlockComponent filename="lib/zenblog.ts" language="tsx">
            {`export type PostWithContent = Post & {
  html_content: string;
};`}
          </CodeBlockComponent>
        </section>

        <section>
          <h2 id="author-type">Author type</h2>
          <p>Authors of the post.</p>
          <CodeBlockComponent filename="lib/zenblog.ts" language="tsx">
            {`export type Author = {
  name: string;
  slug: string;
  image_url: string;
  bio?: string;
  twitter_url?: string;
  website_url?: string;
};`}
          </CodeBlockComponent>
        </section>

        <section>
          <h2 id="category-type">Category type</h2>
          <p>
            Category of the post. Posts can have <strong>one</strong> category.
          </p>
          <CodeBlockComponent filename="lib/zenblog.ts" language="tsx">
            {`export type Category = {
  slug: string;
  name: string;
};`}
          </CodeBlockComponent>
        </section>

        <section>
          <h2 id="tag-type">Tag type</h2>
          <p>
            Tags of the post. Posts can have <strong>multiple</strong> tags.
          </p>
          <CodeBlockComponent filename="lib/zenblog.ts" language="tsx">
            {`export type Tag = {
  slug: string;
  name: string;
};`}
          </CodeBlockComponent>
        </section>
      </div>
    </DocsPageLayout>
  );
}
