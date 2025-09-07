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
import { cn, getMediaType } from "@/lib/utils";
import { CheckIcon, Loader2 } from "lucide-react";
import { useMediaQuery } from "./Images.queries";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

export type Media = {
  id: string;
  name: string;
  url: string | null;
  created_at: string;
  supabase_hosted?: boolean;
  size_in_bytes?: number | null;
  isYoutube?: boolean;
};

export function ImagePicker({
  children,
  onSelect,
  onCancel,
  open,
  onOpenChange,
  showFooter = true,
}: PropsWithChildren<{
  onSelect: (media: Media) => void;
  onCancel: () => void;
  open: boolean;
  ref?: any;
  onOpenChange: (value: boolean) => void;
  showFooter?: boolean;
}>) {
  const router = useRouter();
  const { blogId } = router.query as any;
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const media = useMediaQuery(blogId, {
    enabled: open,
  });

  const [tab, setTab] = useState("images");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const isVideo = (url: string) => {
    if (url.includes("youtube.com")) {
      return true;
    }
    const videoFormats = ["mp4", "webm", "ogg"];
    return videoFormats.some((format) => url.endsWith(`.${format}`));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">Upload image</DialogTitle>
        <div>
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
                    {media?.isLoading ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-28">
                        <Loader2 size={24} className="animate-spin" />
                      </div>
                    ) : null}
                    {media?.data?.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-28">
                        <p className="text-sm text-zinc-500">No images found</p>
                      </div>
                    ) : null}
                    {media.data?.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          "group flex flex-col gap-1 rounded-xl text-left transition-all hover:opacity-90"
                        )}
                        onClick={() => {
                          setSelectedMedia(item);
                          onSelect(item);
                        }}
                      >
                        <div className="relative w-full">
                          {/* Handle null URL for getMediaType */}
                          {getMediaType(item.url ?? "") === "video" ? (
                            <div className="relative h-32 w-full overflow-hidden rounded-xl">
                              <video
                                className="h-32 w-full rounded-xl object-cover shadow-sm"
                                // Handle null URL for src
                                src={item.url ?? undefined}
                              />
                              <div className="absolute bottom-2 left-2 rounded-md bg-black/50 p-1 text-sm text-white">
                                Video
                              </div>
                            </div>
                          ) : // Handle null URL for Image component: Render placeholder if null
                          item.url ? (
                            <img
                              className="h-32 w-full rounded-xl object-cover shadow-sm"
                              width={240}
                              height={128}
                              src={item.url}
                              alt={item.name}
                              loading="lazy"
                            />
                          ) : (
                            // Placeholder for null URL
                            <div className="flex h-32 w-full items-center justify-center rounded-xl border bg-zinc-100 text-zinc-400">
                              No Preview
                            </div>
                          )}
                          <div
                            className={cn(
                              "absolute right-1.5 top-1.5 h-6 w-6 rounded-full border border-zinc-200 bg-zinc-100/50 opacity-0 bg-blend-darken transition-all group-hover:opacity-100",
                              "flex items-center justify-center",
                              {
                                "border-orange-600 bg-orange-600 text-orange-100 opacity-100":
                                  selectedMedia?.id === item.id,
                              }
                            )}
                          >
                            {selectedMedia?.id === item.id && (
                              <CheckIcon size={12} />
                            )}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "line-clamp-1 font-mono text-xs tracking-tight text-zinc-500 transition-all group-hover:text-zinc-900",
                            {
                              "text-orange-500 group-hover:text-orange-500":
                                selectedMedia?.id === item.id,
                            }
                          )}
                        >
                          {item.name}
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
                          if (!selectedMedia) {
                            return;
                          }
                          onSelect(selectedMedia);
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
              <div className="mx-auto flex max-w-xl flex-col gap-4 py-12">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Image URL
                  </label>
                  <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-zinc-500">Or</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-700">
                    YouTube URL
                  </label>
                  <Input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    className="max-w-xs"
                    onClick={(e) => {
                      e.preventDefault();

                      if (youtubeUrl) {
                        const videoId = getYoutubeVideoId(youtubeUrl);
                        if (videoId) {
                          onSelect({
                            id: "youtube",
                            name: "YouTube video",
                            url: `https://www.youtube.com/embed/${videoId}`,
                            created_at: new Date().toISOString(),
                            isYoutube: true,
                          });
                        } else {
                          toast.error("Invalid YouTube URL");
                          return;
                        }
                      } else if (imageUrl) {
                        onSelect({
                          id: "embed",
                          name: "Embedded media",
                          url: imageUrl,
                          created_at: new Date().toISOString(),
                        });
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ImageSelector = {
  media: Media[];
  onChange: (media: Media[]) => void;
  selected: Media[];
  type: "single" | "multiple";
  disabled: boolean;
};
export function ImageSelector({
  media,
  onChange,
  selected,
  type,
  disabled,
}: ImageSelector) {
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [lastSelectionWasDeselect, setLastSelectionWasDeselect] =
    useState(false);

  function isSelected(item: Media) {
    return selected.find((m) => m.id === item.id) !== undefined;
  }

  function onItemClick(item: Media, index: number, event: React.MouseEvent) {
    if (type === "single") {
      onChange([item]);
      return;
    }

    if (event.shiftKey && lastSelectedIndex !== null && type === "multiple") {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeToToggle = media.slice(start, end + 1);

      // If last action was deselect, deselect the range
      if (lastSelectionWasDeselect) {
        onChange(
          selected.filter(
            (selItem) =>
              !rangeToToggle.some((rangeItem) => rangeItem.id === selItem.id)
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
      const isCurrentlySelected = isSelected(item);
      setLastSelectionWasDeselect(isCurrentlySelected);

      if (isCurrentlySelected) {
        onChange(selected.filter((selItem) => selItem.id !== item.id));
      } else {
        onChange([...selected, item]);
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
              disabled={disabled}
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
          {media.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImageItem
                disabled={disabled}
                item={item}
                selected={isSelected(item)}
                onClick={(clickedItem, event) =>
                  onItemClick(clickedItem, index, event)
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

type ImageItem = {
  item: Media;
  selected: boolean;
  onClick: (item: Media, event: React.MouseEvent) => void;
  disabled: boolean;
};
export function ImageItem({ item, selected, onClick, disabled }: ImageItem) {
  // Handle null URL for getMediaType
  const mediaType = getMediaType(item.url ?? "");
  const displaySize = formatBytes(item.size_in_bytes);

  return (
    <button
      type="button"
      key={item.id}
      className={cn(
        "group flex w-full max-w-[240px] flex-col gap-0.5 rounded-xl text-left transition-all hover:opacity-90"
      )}
      onClick={(e) => {
        if (disabled) return;
        onClick(item, e);
      }}
      disabled={disabled}
    >
      <div className="relative w-full">
        {mediaType === "video" ? (
          <video
            className={cn(
              "h-28 w-full rounded-lg border border-zinc-200 object-cover shadow-sm",
              {
                "border-orange-500 opacity-70": selected,
              }
            )}
            // Handle null URL for src: Render placeholder if null
            src={item.url ?? undefined}
          />
        ) : item.url ? (
          <img
            className={cn(
              "h-28 w-full rounded-lg border border-zinc-200 object-cover shadow-sm",
              {
                "border-orange-500 opacity-70": selected,
              }
            )}
            width={240}
            height={112}
            // Handle null URL for img tag: Render placeholder if null
            src={item.url} // URL is guaranteed string here
            alt={item.name}
            loading="lazy"
          />
        ) : (
          <div className="flex h-28 w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-400">
            No Preview
          </div>
        )}

        {/* Media Type Pill */}
        <div className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-xs font-medium text-white">
          {mediaType === "video" ? "video" : "img"}
        </div>

        {/* Selection Checkmark - slightly adjusted positioning if needed */}
        <div
          className={cn(
            "absolute right-1.5 top-1.5 h-6 w-6 rounded-full border border-zinc-200 bg-zinc-100/50 opacity-0 bg-blend-darken transition-all group-hover:opacity-100", // Adjusted top position slightly
            "flex items-center justify-center",
            {
              "border-orange-600 bg-orange-600 text-orange-100 opacity-100":
                selected,
              "opacity-0 group-hover:opacity-0": disabled,
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
        <p title={item.name} className="truncate">
          {item.name}
        </p>
        {item.size_in_bytes && (
          <span className="text-xs text-zinc-400">{displaySize}</span>
        )}
      </div>
    </button>
  );
}

function formatBytes(bytes?: number | null, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2]?.length === 11 ? match[2] : null;
}
