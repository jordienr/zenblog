import AppLayout from "@/layouts/AppLayout";
import { generateSlug } from "@/lib/utils/slugs";
import { useCreateBlogMutation } from "@/queries/blogs";
import { useAppStore } from "@/store/app";
// import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CreateBlog() {
  type FormData = {
    title: string;
    description: string;
    emoji: string;
    slug: string;
  };
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  // const { getToken } = useAuth();
  const router = useRouter();
  const watchTitle = watch("title");
  const store = useAppStore();

  useEffect(() => {
    if (watchTitle) {
      const slug = generateSlug(watchTitle);
      setValue("slug", slug);
    }
  }, [watchTitle, setValue]);

  const createBlog = useCreateBlogMutation();

  const onSubmit = async (data: FormData) => {
    store.startLoading();

    const res = await createBlog.mutateAsync({
      title: data.title,
      description: data.description,
      emoji: data.emoji,
    });

    console.log(res);

    if (createBlog.isError) {
      console.error(createBlog.error);
      alert("Error creating blog, please try again");
    } else {
      store.stopLoading();
      await router.push("/blogs");
    }
  };

  watch("title");

  return (
    <AppLayout>
      <div className="mx-auto mt-12 max-w-xs">
        <h1 className="text-center text-xl font-semibold">Create a blog</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title">
            <span className="block">Title</span>
            <input type="text" id="title" required {...register("title")} />
          </label>

          <label htmlFor="description">
            <span className="block">Description</span>
            <input
              type="text"
              id="description"
              required
              {...register("description")}
            />
          </label>
          <label htmlFor="emoji">
            <span className="block">Emoji</span>
            <input type="text" id="emoji" required {...register("emoji")} />
          </label>

          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
