/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ImageIcon, Loader, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { API } from "app/utils/api-client";
import { toast } from "sonner";

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
  const [editableFileName, setEditableFileName] = useState<string>("");

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
    const res = await API().v2.blogs[":blog_id"].images.$post({
      param: {
        blog_id: blogId,
      },
      query: {
        convertToWebp: "true",
        imageName: editableFileName,
      },
      form: {
        image: new File([file], editableFileName, {
          type: file.type,
        }),
      },
    });

    if (res.status !== 200) {
      throw new Error("Error uploading image");
    }

    const url = res.url;

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

    try {
      const URL = await uploadImageToBlogAndGetURL(image);

      if (!URL) return;

      setImage(null);
      setCreateObjectURL(null);
      setImageInfo(null);

      onSuccessfulUpload && onSuccessfulUpload();
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    }
  }

  const uploadToClient = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setImage(imageFile);
      setEditableFileName(imageFile.name.replace(/\.[^/.]+$/, ""));
      const imageInfo = await getImageInfo(imageFile);
      setImageInfo(imageInfo);
      setCreateObjectURL(URL.createObjectURL(imageFile));
      setLoading(false);
    }
  };

  return (
    <div className={cn("max-w-xl", className)}>
      <h2 className="mb-2 flex gap-1.5 font-medium">
        <ImageIcon className="text-orange-500" size="22" /> Upload media
      </h2>
      <form onSubmit={onSubmit}>
        {image && (
          <div className="flex min-h-[300px] flex-col items-center justify-center overflow-auto rounded-lg border p-2">
            {loading && (
              <div className="flex-x-center flex-y-center p-8">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {image && (
              <img
                className="max-h-80 w-full rounded-lg border bg-white object-cover shadow-sm"
                src={createObjectURL || ""}
              />
            )}
            {imageInfo && (
              <div className="w-full px-1">
                <div className="mt-2 grid w-full gap-2 font-mono tracking-tight">
                  <input
                    type="text"
                    name="filename"
                    id="filename"
                    value={editableFileName}
                    onChange={(e) => setEditableFileName(e.target.value)}
                    className="w-full border-b bg-white px-1 text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400"
                  />
                  <span className="text-xs text-slate-500">
                    Original resolution:{" "}
                    {`${imageInfo.height}x${imageInfo.width}px`}
                  </span>
                  <span className="text-xs text-slate-500">
                    Original size: {imageInfo.size}
                  </span>
                </div>
                <p className="mt-4 text-xs italic text-slate-500">
                  Note: Image will be compressed and converted to WebP format
                  for optimal performance
                </p>
              </div>
            )}
          </div>
        )}

        {!image && (
          <div>
            <div
              className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-2 text-center font-medium"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-orange-500");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-orange-500");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-orange-500");

                uploadToClient({
                  target: { files: e.dataTransfer.files },
                } as any);
              }}
            >
              <ImageIcon className="text-slate-400" size="24" />
              <h3 className="text-slate-600">Drag and drop an image here</h3>
            </div>
            <Input
              className="mt-2"
              type="file"
              name="file"
              onChange={uploadToClient}
              multiple
            />
          </div>
        )}

        <div className="actions mt-4">
          {!image && (
            <div className="mr-auto text-center text-sm text-slate-400">
              Cmd + V to paste an image
            </div>
          )}
          {image && (
            <>
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
              <Button variant="default" type="submit">
                Upload
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
