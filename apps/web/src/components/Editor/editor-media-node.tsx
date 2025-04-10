/* eslint-disable @next/next/no-img-element */
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { ImagePicker } from "../Images/ImagePicker";
import { Button } from "../ui/button";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";

function AltTextArea({
  alt,
  setAlt,
}: {
  alt: string;
  setAlt: (alt: string) => void;
}) {
  return (
    <textarea
      onClick={(e) => e.stopPropagation()}
      rows={1}
      placeholder="Add an alt tag for better SEO and accessibility"
      className="w-full resize-none rounded-lg bg-slate-100 p-1 text-xs focus-visible:outline-none"
      value={alt}
      onChange={(e) => setAlt(e.target.value)}
    />
  );
}

export function EditorMediaNode({
  node,
  editor,
}: {
  node: Node;
  editor: Editor;
}) {
  const { src } = node.attrs;
  const [showImagePicker, setShowImagePicker] = useState(src ? false : true);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [alt, setAlt] = useState(node.attrs.alt || "");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [videoDimensions, setVideoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(
    node.attrs.videoDimensions ? JSON.parse(node.attrs.videoDimensions) : null
  );

  function setImageSrc(src: string) {
    const isVideo = videoFormats.some((format) => src?.endsWith(`.${format}`));
    editor.commands.updateAttributes("image", {
      src,
      isVideo: isVideo.toString(),
      isYoutube: "false",
    });
  }

  function setYoutubeVideo(url: string) {
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
      // Replace the current image with the youtube video
      editor.commands.updateAttributes("image", {
        src: `https://www.youtube.com/embed/${videoId}`,
        isVideo: "true",
        isYoutube: "true",
      });
    }
  }

  function getYoutubeVideoId(url: string): string | null {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2]?.length === 11 ? match[2] : null;
  }

  function updateAlt(newAlt: string) {
    setAlt(newAlt);
    editor.commands.updateAttributes("image", { alt: newAlt });
  }

  const videoFormats = ["mp4", "webm", "ogg"];
  const isVideo = node.attrs.isVideo === "true";
  const isYoutube = node.attrs.isYoutube === "true";

  console.log("🔴 isYoutube", node.attrs);

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const dimensions = {
      width: video.videoWidth,
      height: video.videoHeight,
    };
    setVideoDimensions(dimensions);
    editor.commands.updateAttributes("image", {
      videoDimensions: JSON.stringify(dimensions),
    });
  };

  return (
    <NodeViewWrapper>
      <div className="flex flex-col gap-1">
        {src && (
          <div className="group/img relative flex flex-col gap-1">
            {isYoutube ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={src}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
                  <span>YouTube</span>
                </div>
              </div>
            ) : isVideo ? (
              <>
                <video
                  className="!my-0 w-full rounded-md border object-contain"
                  src={src}
                  controls
                  playsInline
                  onLoadedMetadata={handleVideoLoad}
                  style={{
                    aspectRatio: videoDimensions
                      ? `${videoDimensions.width} / ${videoDimensions.height}`
                      : undefined,
                  }}
                />
                {videoDimensions && (
                  <div className="flex items-center justify-end gap-2 text-xs text-zinc-500">
                    <span>
                      {videoDimensions.width} × {videoDimensions.height}
                    </span>
                    <span className="text-zinc-400">|</span>
                    <span>
                      {Math.round(
                        (videoDimensions.width / videoDimensions.height) * 100
                      ) / 100}
                      :1
                    </span>
                  </div>
                )}
              </>
            ) : (
              <img
                className="!my-0 w-full rounded-md border object-contain"
                src={src}
                alt={alt}
              />
            )}
            {!isVideo && <AltTextArea alt={alt} setAlt={updateAlt} />}
            <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover/img:opacity-100">
              <Button
                tooltip={{
                  delay: 100,
                  content: "Remove media",
                  side: "bottom",
                }}
                size="icon-xs"
                variant="secondary"
                onClick={() => editor.commands.deleteSelection()}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {!src && (
          <div className="realtive mt-4 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowImagePicker(true)}
              >
                Add Media
              </Button>
            </div>
            <button
              className="absolute right-2 top-2 rounded-full border bg-white p-1"
              onClick={() => editor.commands.deleteSelection()}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        {showImageUrlInput && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed p-4">
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button
              onClick={() => {
                setImageSrc(imageUrl);
                setShowImageUrlInput(false);
              }}
            >
              Save
            </Button>
          </div>
        )}
        {showYoutubeInput && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed p-4">
            <Input
              placeholder="Enter YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <Button
              onClick={() => {
                setYoutubeVideo(youtubeUrl);
                setShowYoutubeInput(false);
              }}
            >
              Save
            </Button>
          </div>
        )}

        <ImagePicker
          onSelect={(image) => {
            console.log("🔴 onSelect", image);
            if (image.isYoutube) {
              setYoutubeVideo(image.url);
              setShowYoutubeInput(false);
            } else {
              setImageSrc(image.url);
              setShowImagePicker(false);
            }
            setShowImagePicker(false);
          }}
          onCancel={() => {
            setImageSrc("");
            setShowImagePicker(false);
          }}
          open={showImagePicker}
          onOpenChange={setShowImagePicker}
          showFooter={false}
        />
      </div>
    </NodeViewWrapper>
  );
}
