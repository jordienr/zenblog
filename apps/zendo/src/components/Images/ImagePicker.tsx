/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { createAPIClient } from "@/lib/app/api";
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
import { BlogImage } from "@/lib/types/BlogImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      <DialogTrigger>{children}</DialogTrigger>
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
                <div className="grid grid-cols-2 gap-1">
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
                        "flex items-center gap-2 rounded-md border border-transparent p-2 transition-all hover:border-slate-200 hover:bg-slate-50",
                        {
                          "border-orange-300 bg-orange-100 hover:border-orange-300 hover:bg-orange-100":
                            selectedImage?.id === image.id,
                        }
                      )}
                      onClick={() => {
                        setSelectedImage(image);
                      }}
                    >
                      <div>
                        <img
                          className="h-12 w-12 rounded-md object-cover"
                          width="48"
                          height="48"
                          src={image.url}
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm">{image.name}</span>
                        <div className="flex items-center gap-2">
                          {/* <Button onClick={() => onSelectClick(image)}>
                            Select
                          </Button> */}
                          {/* <Button
                          size={"sm"}
                          className="h-8"
                          type="button"
                          variant={"outline"}
                          onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            toast.success("Copied to clipboard");
                          }}
                        >
                          <HiOutlineClipboard />
                          Copy URL
                        </Button> */}
                        </div>
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
