import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEditor, EditorContent, ReactNodeViewRenderer, } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { CodeBlockComponent } from "./CodeBlockComponent";
export const ContentRenderer = ({ content }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent);
                },
            }).configure({ lowlight }),
        ],
        content,
        editable: false,
    });
    return (_jsx(_Fragment, { children: _jsx(EditorContent, { editor: editor }) }));
};
