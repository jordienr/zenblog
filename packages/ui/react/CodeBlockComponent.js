import { jsx as _jsx } from "react/jsx-runtime";
// import "./CodeBlockComponent.scss";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
export function CodeBlockComponent({ node: { attrs: { language: defaultLanguage }, }, updateAttributes, extension, }) {
    return (_jsx(NodeViewWrapper, { className: "code-block", children: _jsx("pre", { children: _jsx(NodeViewContent, { as: "code" }) }) }));
}
