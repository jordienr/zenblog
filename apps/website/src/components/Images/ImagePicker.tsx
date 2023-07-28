/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { createAPIClient } from "@/lib/app/api";
import { getApiClientDB } from "@/lib/server/handler";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import { HiUpload, HiX } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { ImageUploader } from "./ImageUploader";

export function ImagePicker({ children }: PropsWithChildren<{}>) {
  const [showDialog, setShowDialog] = useState(false);
  const api = createAPIClient();
  const router = useRouter();
  const { blogId } = router.query as any;

  const { data } = useQuery(["images"], () => api.images.getAll(blogId));

  return (
    <>
      <button onClick={() => setShowDialog(!showDialog)}>{children}</button>

      {showDialog && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 p-8 md:p-24">
          <div className="max-h-full w-full max-w-2xl rounded-xl bg-white">
            <div className="flex items-center justify-between px-4 py-2">
              <h2 className="text-xl font-medium">Images</h2>
              <button
                className="btn btn-icon"
                onClick={() => setShowDialog(false)}
              >
                <HiX />
              </button>
            </div>
            <div className="flex flex-col overflow-auto p-2">
              {data?.map((image) => (
                <div className="flex items-center gap-2" key={image.id}>
                  <img width="240" height="240" src={image.url} />
                  <div className="flex flex-col">
                    <span>{image.name}</span>
                    <div className="flex gap-3 py-3">
                      <button className="btn">Copy URL</button>
                      <button className="btn btn-primary">Select</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full p-3">
              <ImageUploader />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
