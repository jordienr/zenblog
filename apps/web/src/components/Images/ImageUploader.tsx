/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import imageCompression from "browser-image-compression";
import { ImageIcon, Loader } from "lucide-react";
import { Input } from "../ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

type Props = {
  blogId: string;
  onSuccessfulUpload?: () => void;
  className?: string;
};
export const ImageUploader = ({
  blogId,
  onSuccessfulUpload,
  className,
}: Props) => {
  const [image, setImage] = useState(null as File | null);
  const [createObjectURL, setCreateObjectURL] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const supa = getSupabaseBrowserClient();

  useEffect(() => {
    // on mount, listen for paste events
    // if the paste event has image data, add it to the input for upload
    const handlePaste = (e: ClipboardEvent) => {
      setLoading(true);
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          if (blob) {
            uploadToClient({ target: { files: [blob] } } as any);
            // setImage(blob);
            // setCreateObjectURL(URL.createObjectURL(blob));
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  async function uploadImageToBlogAndGetURL(file: File) {
    const randomId = nanoid(8);

    let ogNameWithoutExt = file.name.split(".").slice(0, -1).join(".");

    if (ogNameWithoutExt.length > 48) {
      ogNameWithoutExt = ogNameWithoutExt.slice(0, 48);
    }

    const fileExtension = file.name.split(".").pop();

    const newName = `${ogNameWithoutExt}-${randomId}.${fileExtension}`;

    const { data, error } = await supa.storage
      .from("images")
      .upload(`${blogId}/${newName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(error);
      alert(error.message);
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
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
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
      const imageFile = e.target.files[0];

      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(imageFile, options);

      setImage(compressedFile);
      const imageInfo = await getImageInfo(compressedFile);
      setImageInfo(imageInfo);
      setCreateObjectURL(URL.createObjectURL(compressedFile));
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "",
        {
          "w-full": image,
          "w-[360px]": !image,
        },
        className
      )}
    >
      <h2 className="mb-2 flex gap-1.5 font-medium">
        <ImageIcon className="text-orange-500" size="22" /> Upload media
      </h2>
      <form onSubmit={onSubmit}>
        {image && (
          <div className="bg-grid-slate-100 flex min-h-[300px] flex-col items-center justify-center overflow-auto rounded-lg border bg-slate-50 p-2">
            {loading && (
              <div className="flex-x-center flex-y-center p-8">
                <Loader className="animate-spin" />
              </div>
            )}
            {image && (
              <img
                className="max-h-80 border bg-white shadow-sm"
                src={createObjectURL || ""}
              />
            )}
            {imageInfo && (
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    name="filename"
                    id="filename"
                    value={
                      image.name.length > 20
                        ? `${image.name.slice(0, 20)}...`
                        : image.name
                    }
                    className="bg-transparent text-slate-500"
                  />
                  <span className=" text-slate-500">{`${imageInfo.height}x${imageInfo.width}px`}</span>
                  <span className=" text-slate-500">{imageInfo.size}</span>
                </div>
                <div>
                  <Button
                    variant={"ghost"}
                    className="text-red-500"
                    onClick={() => {
                      setImage(null);
                      setCreateObjectURL(null);
                      setImageInfo(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!image && (
          <Input
            className="mt-2"
            type="file"
            name="file"
            onChange={uploadToClient}
            multiple
          />
        )}

        <div className="actions mt-4">
          <div className="mr-auto text-center text-sm text-slate-400">
            Cmd + V to paste an image
          </div>
          <Button variant="default" type="submit">
            Upload
          </Button>
        </div>
      </form>
    </div>
  );
};
