import { jsx as _jsx } from "react/jsx-runtime";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
const extensions = [StarterKit];
export const ZenblogRenderer = (props) => {
    const editor = useEditor({
        extensions,
        content: props.content,
        editable: false,
    });
    return _jsx(EditorContent, { editor: editor });
};
