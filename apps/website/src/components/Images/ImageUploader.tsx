/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { createAPIClient } from "@/lib/app/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type Props = {
  blogId: string;
  onSuccessfulUpload?: () => void;
};
export const ImageUploader = ({ blogId, onSuccessfulUpload }: Props) => {
  const router = useRouter();
  const [image, setImage] = useState(null as File | null);
  const [createObjectURL, setCreateObjectURL] = useState(null as string | null);
  const [imageInfo, setImageInfo] = useState(null as any);

  const supa = useSupabaseClient();

  async function uploadImageToBlogAndGetURL(file: File) {
    const { data, error } = await supa.storage
      .from("images")
      .upload(`${blogId}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(error);
      alert(error);
      return;
    }

    const url = data?.path;

    return url;
  }

  function getImageInfo(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();

        img.onload = function () {
          resolve({
            width: img.width,
            height: img.height,
          });
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!image) return;

    const URL = await uploadImageToBlogAndGetURL(image);

    if (!URL) return;

    setImage(null);
    setCreateObjectURL(null);
    setImageInfo(null);

    onSuccessfulUpload && onSuccessfulUpload();

    console.log(URL);
  }

  const uploadToClient = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];

      setImage(i);
      const imageInfo = await getImageInfo(i);
      setImageInfo(imageInfo);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit}>
        {image && (
          <div className="bg-grid-slate-200 flex flex-col items-center justify-center overflow-auto rounded-xl border bg-slate-100 p-4">
            <img
              className="max-h-80 border bg-white shadow-sm"
              src={createObjectURL || ""}
            />
            {imageInfo && (
              <span className="font-mono text-slate-500">{`${imageInfo.height}x${imageInfo.width}px`}</span>
            )}
          </div>
        )}

        <input
          className="mt-4 font-mono"
          type="file"
          name="file"
          onChange={uploadToClient}
          multiple
        />
        <div className="actions mt-4">
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </div>
      </form>
    </div>
  );
};
