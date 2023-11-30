/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { createAPIClient } from "@/lib/app/api";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import { HiOutlineClipboard } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { ImageUploader } from "./ImageUploader";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BlogImage } from "@/lib/types/BlogImage";
import { Clipboard, Image } from "lucide-react";

export function ImagePicker({
  children,
  onSelect,
}: PropsWithChildren<{
  onSelect: (image: BlogImage) => void;
}>) {
  const api = createAPIClient();
  const router = useRouter();
  const { blogId } = router.query as any;
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery(["images"], () =>
    api.images.getAll(blogId)
  );

  function onSelectClick(image: BlogImage) {
    onSelect(image);
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-medium">Images</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <button className="group space-y-0.5 rounded-lg border px-4 py-2 font-medium shadow-sm transition-all hover:shadow-md ">
            <Image className="text-orange-400 transition-all group-hover:-translate-y-0.5" />
            <div>Image galery</div>
          </button>
          {showMediaLibrary && (
            <div className="relative flex flex-col">
              {data?.map((image) => (
                <div className="flex gap-2 border-b py-4" key={image.id}>
                  <div>
                    <img
                      className="rounded-lg border"
                      width="69"
                      height="69"
                      src={image.url}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono">{image.name}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <button className="btn">
                        <HiOutlineClipboard />
                        Copy URL
                      </button>
                      <button
                        onClick={() => onSelectClick(image)}
                        className="btn btn-primary"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <ImageUploader onSuccessfulUpload={() => refetch()} blogId={blogId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
