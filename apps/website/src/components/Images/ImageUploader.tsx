/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { createAPIClient } from "@/lib/app/api";
import { useRouter } from "next/router";
import { useState } from "react";

export const ImageUploader = () => {
  const router = useRouter();
  const [image, setImage] = useState(null as File | null);
  const [createObjectURL, setCreateObjectURL] = useState(null as string | null);

  const blogId = router.query.blogId as string;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    console.log("ImageUploader.tsx: ", formData);

    const fileName = e.currentTarget.file.name;

    console.log("ImageUploader.tsx: ", fileName);

    const api = createAPIClient();

    await api.images.upload(blogId, file as File);
  }

  const uploadToClient = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  return (
    <div className="w-full">
      <form
        encType="multipart/form-data"
        action={`/api/blogs/${blogId}/upload`}
        method="POST"
      >
        <img src={createObjectURL || ""} />

        <input type="file" name="file" onChange={uploadToClient} multiple />
        <button className="btn" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};
