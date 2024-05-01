import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

type Props = {
  content?: string;
};

const Editor = (props: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4, 5, 6],
        },
      }),
    ],
    content: props.content || "",
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};
