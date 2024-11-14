/* eslint-disable @next/next/no-img-element */
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { ImagePicker } from "../Images/ImagePicker";
import { Button } from "../ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
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

export function EditorImageNode({
  node,
  editor,
}: {
  node: Node;
  editor: Editor;
}) {
  const { src } = node.attrs;
  const [showImagePicker, setShowImagePicker] = useState(src ? false : true);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [alt, setAlt] = useState(node.attrs.alt || "");
  const [imageUrl, setImageUrl] = useState("");

  function setImageSrc(src: string) {
    editor.commands.updateAttributes("image", { src });
  }

  function updateAlt(newAlt: string) {
    setAlt(newAlt);
    editor.commands.updateAttributes("image", { alt: newAlt });
  }

  return (
    <NodeViewWrapper>
      <div className="flex flex-col gap-1">
        {src && (
          <div className="group/img flex flex-col gap-1">
            <img
              className="!mb-0 w-full rounded-md border object-contain"
              src={src}
              alt={alt}
            />
            <AltTextArea alt={alt} setAlt={updateAlt} />
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/img:opacity-100">
              <Button
                tooltip={{
                  delay: 100,
                  content: "Delete image",
                  side: "bottom",
                }}
                size="icon-xs"
                variant="outline"
                onClick={() => editor.commands.deleteSelection()}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <Button
                tooltip={{
                  delay: 100,
                  content: "Edit image",
                  side: "bottom",
                }}
                size="icon-xs"
                variant="outline"
                onClick={() => setShowImagePicker(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {!src && (
          <div className="mt-4 flex items-center justify-center rounded-md border border-dashed p-4">
            <Button variant="outline" onClick={() => setShowImagePicker(true)}>
              Add Image
            </Button>
          </div>
        )}
        {showImageUrlInput && (
          <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed p-4">
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

        <ImagePicker
          onSelect={(image) => {
            setImageSrc(image.url);
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
