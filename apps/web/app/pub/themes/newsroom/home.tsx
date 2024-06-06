/* eslint-disable @next/next/no-img-element */
import { BlogHomeProps } from "app/types";
import { FadeIn } from "app/ui/fade-in";
import { ZenblogFooter } from "app/ui/zenblog-footer";
import { formatPostDate } from "app/utils/dates";
import Link from "next/link";

export function NewsroomHome({ posts, blog, disableLinks }: BlogHomeProps) {
  const latestPost = posts[0];
  const postsWithoutLatest = posts.slice(1);

  return (
    <div className="bg-white text-stone-700">
      <header className="bg-stone-800 text-white">
        <div className="mx-auto flex max-w-3xl p-3 text-sm">
          <h2 className="font-medium">{blog?.title}</h2>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-3 pt-6 text-xl font-medium">Blog</div>

      {posts?.length === 0 && (
        <>
          <div className="">
            <h2 className="font-medium">No posts yet</h2>
            <p className="font-mono text-stone-500">
              Check back later, see you soon!
            </p>
          </div>
        </>
      )}

      <div className="bg-gray-100/80 p-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href={disableLinks ? "#" : `/${latestPost?.slug}`}
            className="grid overflow-hidden rounded-2xl border bg-white transition-all md:grid-cols-6"
          >
            {latestPost?.cover_image && (
              <img
                className="col-span-4 w-full object-cover"
                src={latestPost?.cover_image}
                alt={latestPost?.title}
              />
            )}
            <div className="col-span-2 flex flex-col justify-end p-4">
              <div>
                <span className="rounded-full text-xs font-medium text-stone-400">
                  LATEST
                </span>
              </div>
              <h2 className="text-xl font-medium">{latestPost?.title}</h2>
              <p className="mt-auto font-mono text-sm text-stone-600">
                {formatPostDate(latestPost?.published_at || "")}
              </p>
            </div>
          </Link>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {postsWithoutLatest?.map((post, index) => (
              <FadeIn delay={index * 0.05} key={post.slug}>
                <Link
                  className="group grid overflow-hidden rounded-xl border bg-white transition-all hover:bg-stone-50"
                  key={post.slug}
                  href={disableLinks ? "#" : `/${post.slug}`}
                >
                  {post.cover_image ? (
                    <img
                      className="h-40 w-full object-cover"
                      src={post.cover_image}
                      alt={post.title}
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-stone-800 text-4xl">
                      📰
                    </div>
                  )}
                  <div className="grid p-2 px-3">
                    <span className="text-zinc-800 group-hover:text-zinc-950">
                      {post.title}
                    </span>
                    <span className="font-mono text-xs tracking-tight text-stone-400 sm:text-sm">
                      {formatPostDate(post.published_at)}
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <ZenblogFooter />
    </div>
  );
}
