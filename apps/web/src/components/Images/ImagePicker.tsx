/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
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
import { CheckIcon } from "lucide-react";
import { useMediaQuery } from "./Images.queries";
import { TooltipProvider } from "../ui/tooltip";
import { Input } from "../ui/input";

export type Image = {
  id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export function ImagePicker({
  children,
  onSelect,
  onCancel,
  open,
  onOpenChange,
  showFooter = true,
}: PropsWithChildren<{
  onSelect: (image: Image) => void;
  onCancel: () => void;
  open: boolean;
  ref?: any;
  onOpenChange: (value: boolean) => void;
  showFooter?: boolean;
}>) {
  const router = useRouter();
  const { blogId } = router.query as any;
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const media = useMediaQuery(blogId, {
    enabled: open,
  });

  const [tab, setTab] = useState("images");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Upload image
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="images">My images</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>
            <TabsContent value="images">
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {media.data?.length === 0 ? (
                    <div className="col-span-2 py-24">
                      <p className="text-center text-sm text-gray-500">
                        No images uploaded yet
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {media.data?.map((image) => (
                    <button
                      type="button"
                      key={image.id}
                      className={cn(
                        "group flex flex-col gap-1 rounded-xl text-left transition-all hover:opacity-90"
                      )}
                      onClick={() => {
                        setSelectedImage(image);
                        onSelect(image);
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
                {showFooter && (
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
                )}
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <ImageUploader
                className="w-full max-w-full"
                onSuccessfulUpload={() => {
                  media.refetch();
                  toast.success("Image uploaded");
                  setTab("images");
                }}
                blogId={blogId}
              />
            </TabsContent>
            <TabsContent value="embed">
              <div className="flex flex-col gap-2 py-8 ">
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                <Button
                  className="mx-auto max-w-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect({
                      id: "embed",
                      name: "Embedded image",
                      url: imageUrl,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
                  }}
                >
                  Save
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ImageSelector = {
  images: Image[];
  onChange: (image: Image[]) => void;
  selected: Image[];
  type: "single" | "multiple";
};
export function ImageSelector({
  images,
  onChange,
  selected,
  type,
}: ImageSelector) {
  function isSelected(image: Image) {
    return selected.find((img) => img.id === image.id) !== undefined;
  }

  function onItemClick(image: Image) {
    if (type === "single") {
      onChange([image]);
    } else {
      if (selected?.find((img) => img.id === image.id)) {
        onChange(selected.filter((img) => img.id !== image.id));
      } else {
        onChange([...selected, image]);
      }
    }
  }

  return (
    <TooltipProvider>
      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((img) => (
          <ImageItem
            key={img.id}
            image={img}
            selected={isSelected(img)}
            onClick={onItemClick}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

function getImageName(str: string) {
  if (str.length > 20) {
    return str.slice(0, 20) + "...";
  } else {
    return str;
  }
}

type ImageItem = {
  image: Image;
  selected: boolean;
  onClick: (image: Image) => void;
};
export function ImageItem({ image, selected, onClick }: ImageItem) {
  return (
    <button
      type="button"
      key={image.id}
      className={cn(
        "group flex max-w-[240px] flex-col gap-0.5 rounded-xl text-left transition-all hover:opacity-90"
      )}
      onClick={() => {
        onClick(image);
      }}
    >
      <div className="relative w-full">
        <img
          className={cn(
            "h-28 w-full rounded-xl border border-zinc-100 object-cover shadow-sm",
            {
              "opacity-70": selected,
            }
          )}
          width="32"
          height="32"
          src={image.url}
        />

        <div
          className={cn(
            "absolute right-1.5 top-1.5 h-6 w-6 rounded-full border border-zinc-200 bg-zinc-100/50 opacity-0 bg-blend-darken transition-all group-hover:opacity-100",
            "flex items-center justify-center",
            {
              "border-orange-600 bg-orange-600 text-orange-100 opacity-100":
                selected,
            }
          )}
        >
          {selected && <CheckIcon size={12} />}
        </div>
      </div>
      <div
        className={cn(
          "line-clamp-1 flex items-center font-mono text-xs tracking-tight text-zinc-500 transition-all group-hover:text-zinc-900",
          {
            "text-orange-500 group-hover:text-orange-500": selected,
          }
        )}
      >
        <div className="flex w-full items-center gap-1.5 overflow-hidden break-words p-1">
          <p
            title={image.name}
            className="line-clamp-1 text-ellipsis text-left"
          >
            {getImageName(image.name)}
          </p>
        </div>
      </div>
    </button>
  );
}
