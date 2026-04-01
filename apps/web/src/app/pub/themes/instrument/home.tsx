import { BlogHomeProps } from "app/types";
import { formatPostDate } from "app/utils/dates";
import Link from "next/link";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import { SocialLinks } from "app/ui/SocialLinks";

const serif = Instrument_Serif({
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
});

const sans = Instrument_Sans({
  display: "swap",
  subsets: ["latin"],
});

export function InstrumentHome({ posts, blog, disableLinks }: BlogHomeProps) {
  return (
    <div
      className={`min-h-screen bg-zinc-900 py-8 text-white ${sans.className}`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <header className="p-6">
            <h1 className={`${serif.className} text-2xl`}>{blog.title}</h1>
            <p className=" text-zinc-300">{blog.description}</p>
            <SocialLinks
              links={blog}
              className="mt-4 text-sm text-white"
              linkClassName="p-0 mr-4 hover:bg-transparent hover:text-orange-500 py-2 text-zinc-300"
            />
          </header>
          <div className="m-3 flex gap-1">
            <div className="h-1 w-60 -skew-x-[30deg] bg-orange-600"></div>
            <div className="h-1 w-2 -skew-x-[30deg] bg-orange-600"></div>
            <div className="h-1 w-2 -skew-x-[30deg] bg-orange-600"></div>
          </div>
          <main>
            <ul>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="group block cursor-default p-4 px-6 transition-all hover:bg-zinc-800/50"
                    href={disableLinks ? "#" : `/${post.slug}`}
                  >
                    <div className="flex justify-between ">
                      <h2 className="group-hover:text-orange-500">
                        {post.title}
                      </h2>
                      <p className="font-mono text-xs text-zinc-400">
                        {formatPostDate(post.published_at)}
                      </p>
                    </div>
                    <div>
                      {post.excerpt && (
                        <p className="text-zinc-400">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </main>

          <footer className="mt-6 border-t border-zinc-800 p-6">
            <p className="font-mono italic text-zinc-300">
              Powered by{" "}
              <a className="underline" href="https://zenblog.com">
                zenblog
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
