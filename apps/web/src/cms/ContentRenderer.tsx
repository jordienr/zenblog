"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

type Props = {
  content: any;
};

const extensions = [StarterKit, Image, Link];
export const ContentRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    editable: false,
  });
  return (
    <div className="prose prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-xl">
      <EditorContent editor={editor}></EditorContent>
    </div>
  );
};
