"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

type Props = {
  content: any;
};

const extensions = [StarterKit, Image];
export const ContentRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    editable: false,
  });
  return (
    <div className="prose">
      <EditorContent editor={editor}></EditorContent>
    </div>
  );
};
