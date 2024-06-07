/* eslint-disable @next/next/no-img-element */
import { BlogHomeProps } from "app/types";
import { ZenblogFooter } from "app/ui/zenblog-footer";
import { formatPostDate } from "app/utils/dates";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const serif = Cormorant_Garamond({
  display: "swap",
  weight: "500",
  subsets: ["latin"],
});

function Separator() {
  return (
    <div
      className={`flex justify-center text-center text-5xl text-emerald-500 ${serif.className}`}
    >
      <svg
        width="40"
        height="27"
        viewBox="0 0 165 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 26C3.66666 10.3333 13.8333 2.5 30.5 2.5C43.8333 2.5 61.3333 5.66667 83 12C107.333 17.3333 124 20 133 20C142.333 20 148.833 18.8333 152.5 16.5C156.167 13.8333 158.833 8.5 160.5 0.5L165 1.5C162 15.8333 154 23.6667 141 25C138.667 25.3333 134 25.5 127 25.5C120.333 25.5 109.167 23 93.5 18C88.5 17 80 15.1667 68 12.5C53.6667 9.16667 41.8333 7.5 32.5 7.5C23.5 7.5 17 8.83334 13 11.5C9.33333 14.1667 6.66667 19.3333 5 27L0 26Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function GardenHome({ blog, posts, disableLinks }: BlogHomeProps) {
  function toLink(href: string) {
    if (disableLinks) {
      return "#";
    }
    return href;
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-white">
      <header>
        <div className="mx-auto max-w-3xl p-3 py-8 text-center text-sm">
          <span className="text-xl">{blog.emoji}</span>
          <h1 className={`text-3xl font-medium ${serif.className}`}>
            {blog?.title}
          </h1>
          <p className="py-1 text-gray-500">{blog?.description}</p>
        </div>
      </header>
      <Separator />
      <div className="p-3">
        <h2 className={`${serif.className} px-4 text-2xl italic`}>Blog </h2>

        <div className="divide mt-4 grid gap-0 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={toLink(`/${post.slug}`)}
              className="flex gap-3 rounded-lg p-2 transition-all hover:bg-gray-50"
            >
              <div className="flex h-24 w-full max-w-32 justify-center overflow-hidden rounded-lg border bg-white">
                {post.cover_image ? (
                  <img
                    className="h-full w-full object-cover"
                    height={128}
                    width={128}
                    src={post.cover_image}
                    alt={post.title}
                  />
                ) : (
                  <div className="flex items-center text-2xl">🍃</div>
                )}
              </div>
              <div className="mt-2 space-y-1 leading-5">
                <h3 className="font-medium">{post.title}</h3>
                <span className="text-xs text-gray-500">
                  {formatPostDate(post.published_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <ZenblogFooter />
    </div>
  );
}
