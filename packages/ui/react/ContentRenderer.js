import { jsx as _jsx } from "react/jsx-runtime";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
export const ContentRenderer = ({ content }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false,
    });
    return _jsx(EditorContent, { editor: editor });
};
