import type { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { getClient } from "@/lib/supabase";
import AppLayout from "@/layouts/AppLayout";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { generateSlug } from "@/lib/utils/slugs";
import { z } from "zod";
import {
  EditorContent,
  JSONContent,
  getSchema,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/app";
import Link from "next/link";
import { Blog } from "@/lib/models/blogs/Blogs";
import ImageExt from "@tiptap/extension-image";

const formSchema = z.object({
  title: z.string(),
  slug: z.string(),
  published: z.boolean(),
});
type FormData = z.infer<typeof formSchema>;

type Props = {
  blog: Blog;
};

export default function BlogDashboard({ blog }: Props) {
  async function getDB() {
    const token = await auth.getToken({ template: "supabase" });
    if (!token) {
      throw new Error("No token");
    }
    return getClient(token);
  }
  const placeholders = [
    "Guide to Starting Your Own Cult",
    "Unleashing Your Inner Cult Leader",
    "Cultivating Devoted Followers",
    "The Art of Indoctrinating Masses",
    "Advanced Techniques for Cultic Success",
    "The Cult Craze",
    "Cultivating Loyalty",
    "Building a Cult Network in Your Community",
    "Unleashing the Power of Groupthink",
    "The Cultpreneur's Handbook",
  ];

  const getRandomPlaceholder = () => {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const placeholder = useMemo(() => getRandomPlaceholder(), []);

  const { handleSubmit, register, setValue } = useForm<FormData>();

  async function uploadImage(file: File) {
    // wait 2s
    // return the image url
    const db = await getDB();

    console.log(auth.userId);

    const { data, error } = await db.storage
      .from("images")
      .upload("image.png", file);

    console.log(data, error);

    return data;
  }
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt,
      Heading.configure({
        levels: [2, 3, 4, 5, 6],
      }),
    ],
    content: "",
    onUpdate(d) {},
    editorProps: {
      handlePaste: function (view, event, slice) {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          console.log(item);
          if (item.type.indexOf("image") === 0) {
            let _URL = window.URL || window.webkitURL;
            let img = new Image(); /* global Image */
            // item to blob
            const _file = item.getAsFile();
            if (!_file) {
              return false;
            }
            const blob = new Blob([_file], { type: "image/png" });

            img.src = _URL.createObjectURL(blob);
            img.onload = function () {
              // valid image so upload to server
              // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
              uploadImage(_file)
                .then(function (response) {
                  // response is the image url for where it has been saved
                  // place the now uploaded image in the editor where it was pasted
                  // const node = schema.nodes.image.create({ src: response }); // creates the image element
                  // const transaction = view.state.tr.replaceSelectionWith(node); // places it in the correct position
                  // view.dispatch(transaction);
                  console.log("fres", response);
                })
                .catch(function (error) {
                  if (error) {
                    window.alert(
                      "There was a problem uploading your image, please try again."
                    );
                  }
                });
            };
            return true; // handled
          }
        }
        return false; // not handled use default behaviour
      },
    },
  });

  const auth = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const blogSlug = router.query.slug as string;
  const store = useAppStore();

  async function recursiveUploadAndReplaceImages(content: JSONContent) {
    const db = await getDB();

    // content.forEach(async (node: JSONContent) => {
    //   if (node.type === "image") {
    //     // upload image
    //     db.storage.from("images").upload("image.png", node.attrs?.src);
    //     // replace image url
    //   }
    //   if (node.content) {
    //     recursiveUploadAndReplaceImages(node.content);
    //   }
    // });
  }

  const onSubmit = handleSubmit(async (data) => {
    store.startLoading();
    const token = await auth.getToken({ template: "supabase" });

    try {
      const formData = formSchema.parse(data);

      if (!token || !auth.userId) {
        alert("Error creating blog, please try again");
        return;
      }

      const sb = getClient(token);

      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: JSON.stringify(editor?.getJSON()),
        blog_slug: blogSlug,
        blog_id: blog.id,
        user_id: auth.userId,
        published: formData.published,
      };

      const res = await sb.from("posts").insert(payload);

      console.log(payload);

      const jsonContent = editor?.getJSON();
      if (!jsonContent) {
        throw new Error("No content");
      }
      const images = recursiveUploadAndReplaceImages(jsonContent);

      console.log(editor?.getJSON());
      console.log(images);

      if (res.error) {
        console.error(res.error);
        if (res.error.code === "23505") {
          alert("A post with that slug already exists");
          return;
        } else {
          alert("Error creating post, please try again");
        }
      } else {
        await router.push(`/blogs/${blogSlug}/posts`);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating blog, please try again");
    } finally {
      store.stopLoading();
    }
  });

  // useEffect(() => {
  //   window.addEventListener("keydown", async (e) => {
  //     if (e.key === "s" && e.metaKey) {
  //       // e.preventDefault();
  //       console.log("saving");
  //     }
  //     if (e.key === "v" && e.metaKey) {
  //       // e.preventDefault();
  //       console.log("pasting");
  //       const clipboard = await navigator.clipboard.readText();
  //       console.log(clipboard);
  //       // if its an image, grab the image and upload it to supabase
  //       const files = await navigator.clipboard.read();
  //       console.log(files);

  //     }
  //   });
  // }, []);

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-5xl flex-col">
        <form
          onSubmit={onSubmit}
          className="flex-grow overflow-y-auto pb-24 pt-3"
        >
          <div className="mx-auto flex max-w-5xl justify-end gap-4 p-4">
            <div className="flex items-center">
              <label
                className="flex items-center gap-2 font-semibold"
                htmlFor="published"
              >
                <input
                  id="published"
                  type="checkbox"
                  {...register("published")}
                  className="h-6 w-6 rounded-md shadow-sm"
                />
                Publish
              </label>
            </div>
            <button type="submit" className="btn btn-primary max-w-[120px]">
              Save
              {/* <Shortcut shortcut="cmd S" /> */}
            </button>
          </div>
          <div className="px-4">
            {/* <Link
              className="inline-flex items-center p-2 text-sm font-medium text-orange-500"
              href={`/blogs/${blogSlug}/posts`}
            >
              <ArrowLeft className="mr-2 inline-block" size={18} />
              {blog.title}
            </Link> */}
          </div>

          <div className="mx-auto flex flex-col gap-3 bg-white font-mono">
            <label
              htmlFor="slug"
              className="flex items-center gap-1 border-b px-2 py-1.5 transition-all hover:bg-white"
            >
              <span className="whitespace-nowrap">{blogSlug}.com/</span>
              <input
                {...register("slug")}
                required
                title="Slug"
                className="focus:ring-none w-full rounded-lg bg-transparent font-mono "
              />
            </label>
            <label htmlFor="title" className="px-2">
              <input
                type="test"
                placeholder={"A really good title"}
                {...register("title", {
                  required: true,
                  onChange: (e) => {
                    setTitle(e.target.value);
                    setValue("slug", generateSlug(e.target.value));
                  },
                })}
                required
                className="focus:ring-none h-12 w-full rounded-lg border-none bg-transparent px-1 text-xl font-semibold text-slate-800 hover:bg-white md:text-3xl"
              />
            </label>

            <EditorContent
              className="prose:min-w-none prose flex min-h-[460px] w-full max-w-none rounded-md px-2 text-lg text-slate-600"
              editor={editor}
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { getToken, userId } = getAuth(ctx.req);
  const token = await getToken({ template: "supabase" });
  const { slug } = ctx.query;

  if (!token || !userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const sb = getClient(token);

  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("blog_slug", slug);

  const blogRes = await sb
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
  }
  if (!blogRes.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blog: {
        ...blogRes.data[0],
      },
      posts: data,
    },
  };
};
