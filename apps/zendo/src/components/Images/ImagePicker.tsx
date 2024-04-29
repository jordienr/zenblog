/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { createAPIClient } from "@/lib/http/api";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle, CheckIcon } from "lucide-react";

export type BlogImage = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export function ImagePicker({
  children,
  onSelect,
  onCancel,
  open,
  onOpenChange,
}: PropsWithChildren<{
  onSelect: (image: BlogImage) => void;
  onCancel: () => void;
  open: boolean;
  ref?: any;
  onOpenChange: (value: boolean) => void;
}>) {
  const api = createAPIClient();
  const router = useRouter();
  const { blogId } = router.query as any;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<BlogImage | null>(null);

  const { data, refetch } = useQuery(["images"], () =>
    api.images.getAll(blogId)
  );

  function onSelectClick(image: BlogImage) {
    onSelect(image);
  }

  const [tab, setTab] = useState("images");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-medium">Upload image</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="images">My images</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="images">
              <div className="relative">
                <div className="grid grid-cols-4 gap-3">
                  {data?.length === 0 ? (
                    <div className="col-span-2 py-24">
                      <p className="text-center text-sm text-gray-500">
                        No images uploaded yet
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {data?.map((image) => (
                    <button
                      type="button"
                      key={image.id}
                      className={cn(
                        "group flex flex-col gap-1 rounded-xl text-left transition-all hover:opacity-90"
                      )}
                      onClick={() => {
                        setSelectedImage(image);
                      }}
                    >
                      <div className="relative w-full">
                        <img
                          className="h-32 w-full rounded-xl object-cover shadow-sm"
                          width="48"
                          height="48"
                          src={image.url}
                        />
                        <div
                          className={cn(
                            "absolute right-1.5 top-1.5 h-6 w-6 rounded-full border border-zinc-200 bg-zinc-100/50 opacity-0 bg-blend-darken transition-all group-hover:opacity-100",
                            "flex items-center justify-center",
                            {
                              "border-orange-600 bg-orange-600 text-orange-100 opacity-100":
                                selectedImage?.id === image.id,
                            }
                          )}
                        >
                          {selectedImage?.id === image.id && (
                            <CheckIcon size={12} />
                          )}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "line-clamp-1 font-mono text-xs tracking-tight text-zinc-500 transition-all group-hover:text-zinc-900",
                          {
                            "text-orange-500 group-hover:text-orange-500":
                              selectedImage?.id === image.id,
                          }
                        )}
                      >
                        {image.name}
                      </div>
                    </button>
                  ))}
                </div>
                <DialogFooter>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!selectedImage) {
                          return;
                        }
                        onSelect(selectedImage);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <div>
                <ImageUploader
                  onSuccessfulUpload={() => {
                    refetch();
                    toast.success("Image uploaded");
                    setTab("images");
                  }}
                  blogId={blogId}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
