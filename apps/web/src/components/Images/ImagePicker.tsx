/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { PropsWithChildren, useState, useRef } from "react";
import { ImageUploader } from "./ImageUploader";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useMediaQuery } from "./Images.queries";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export type Image = {
  id: string;
  name: string;
  url: string;
  created_at: string;
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
      <DialogContent className="max-w-4xl md:max-w-6xl">
        <DialogTitle className="sr-only">Upload image</DialogTitle>
        <div className="">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="images">My images</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>
            <TabsContent value="images">
              <div className="relative">
                <div className="overflow-auto">
                  <div className="grid grid-cols-2 gap-3 p-2 md:grid-cols-3">
                    {media.data?.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        className={cn(
                          "group flex flex-col gap-1 rounded-xl text-left transition-all hover:opacity-90"
                        )}
                        onClick={() => {
                          setSelectedImage(image);
                          onSelect(image);
                        }}
                      >
                        <div className="relative w-full">
                          <Image
                            className="h-32 w-full rounded-xl object-cover shadow-sm"
                            width={240}
                            height={128}
                            src={image.url}
                            alt={image.name}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR4hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            loading="lazy"
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
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [lastSelectionWasDeselect, setLastSelectionWasDeselect] =
    useState(false);

  function isSelected(image: Image) {
    return selected.find((img) => img.id === image.id) !== undefined;
  }

  function onItemClick(image: Image, index: number, event: React.MouseEvent) {
    if (type === "single") {
      onChange([image]);
      return;
    }

    if (event.shiftKey && lastSelectedIndex !== null && type === "multiple") {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeToToggle = images.slice(start, end + 1);

      // If last action was deselect, deselect the range
      if (lastSelectionWasDeselect) {
        onChange(
          selected.filter(
            (img) => !rangeToToggle.some((rangeImg) => rangeImg.id === img.id)
          )
        );
      } else {
        // Add the range to selection
        const combinedSelection = Array.from(
          new Set([...selected, ...rangeToToggle])
        );
        onChange(combinedSelection);
      }
    } else {
      // Single click behavior
      const isCurrentlySelected = isSelected(image);
      setLastSelectionWasDeselect(isCurrentlySelected);

      if (isCurrentlySelected) {
        onChange(selected.filter((img) => img.id !== image.id));
      } else {
        onChange([...selected, image]);
      }
      setLastSelectedIndex(index);
    }
  }

  return (
    <>
      <AnimatePresence>
        {type === "multiple" && selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center justify-end gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onChange([]);
                setLastSelectedIndex(null);
              }}
            >
              Unselect All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
        <AnimatePresence>
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImageItem
                image={img}
                selected={isSelected(img)}
                onClick={(image, event) => onItemClick(image, index, event)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

type ImageItem = {
  image: Image;
  selected: boolean;
  onClick: (image: Image, event: React.MouseEvent) => void;
};
export function ImageItem({ image, selected, onClick }: ImageItem) {
  return (
    <button
      type="button"
      key={image.id}
      className={cn(
        "group flex w-full max-w-[240px] flex-col gap-0.5 rounded-xl text-left transition-all hover:opacity-90"
      )}
      onClick={(e) => {
        onClick(image, e);
      }}
    >
      <div className="relative w-full">
        <Image
          className={cn(
            "h-28 w-full rounded-xl border border-zinc-100 object-cover shadow-sm",
            {
              "opacity-70": selected,
            }
          )}
          width={240}
          height={112}
          src={image.url}
          alt={image.name}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR4hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          loading="lazy"
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
        className={cn("w-full font-mono text-xs tracking-tight text-zinc-500", {
          "text-orange-500 group-hover:text-orange-500": selected,
        })}
      >
        <p title={image.name} className="truncate">
          {image.name}
        </p>
      </div>
    </button>
  );
}
