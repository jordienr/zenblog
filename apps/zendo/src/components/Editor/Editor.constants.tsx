import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  Dot,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ItalicIcon,
  Link,
  ListIcon,
  Pilcrow,
  Strikethrough,
} from "lucide-react";
import { PiCodeBlock, PiListNumbers } from "react-icons/pi";

const SIZE = 18;

const Separator = {
  id: "separator",
  icon: <Dot size={SIZE} />,
  disabled: true,
  command: () => {},
};

const BOLD_BTN = {
  id: "bold",
  tooltip: "Bold (Cmd+B)",
  icon: <BoldIcon size={SIZE} />,
  command: (editor: Editor) => editor?.chain().focus().toggleBold().run(),
};

const ITALIC_BTN = {
  id: "italic",
  tooltip: "Italic (Cmd+I)",
  icon: <ItalicIcon size={SIZE} />,
  command: (editor: Editor) => editor?.chain().focus().toggleItalic().run(),
};

const STRIKETHROUGH_BTN = {
  id: "strike",
  tooltip: "Strikethrough",
  icon: <Strikethrough size={SIZE} />,
  command: (editor: Editor) => editor?.chain().focus().toggleStrike().run(),
};

const CODE_BTN = {
  id: "code",
  tooltip: "Code (Cmd+E)",
  icon: <CodeIcon size={SIZE} />,
  command: (editor: Editor) => editor?.chain().focus().toggleCode().run(),
};

const CODE_BLOCK_BTN = {
  id: "codeBlock",
  tooltip: "Code Block",
  icon: <PiCodeBlock size={SIZE} />,
  command: (editor: Editor) => editor?.chain().focus().toggleCodeBlock().run(),
};

const LINK_BTN = {
  id: "link",
  tooltip: "Link",
  icon: <Link size={SIZE} />,
  command: (editor: Editor) => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  },
};

const LIST_BTN = {
  id: "list",
  tooltip: "List",
  icon: <ListIcon size={SIZE} />,
  command: (editor: Editor) => editor?.chain().focus().toggleBulletList().run(),
};

const NUMBERED_LIST_BTN = {
  id: "numberedList",
  tooltip: "Numbered List",
  icon: <PiListNumbers size={SIZE} />,
  command: (editor: Editor) =>
    editor?.chain().focus().toggleOrderedList().run(),
};

const PARAGRAPH_BTN = {
  id: "paragraph",
  icon: <Pilcrow size={SIZE} />,
  label: "Paragraph",
  command: (editor: Editor) => editor?.chain().focus().setParagraph().run(),
};

const HEADING2_BTN = {
  id: "heading2",
  icon: <Heading2 size={SIZE} />,
  label: "Heading 2",
  command: (editor: Editor) =>
    editor?.chain().focus().setHeading({ level: 2 }).run(),
};

const HEADING3_BTN = {
  icon: <Heading3 size={SIZE} />,
  label: "Heading 3",
  command: (editor: Editor) =>
    editor?.chain().focus().setHeading({ level: 3 }).run(),
};

const HEADING4_BTN = {
  icon: <Heading4 size={SIZE} />,
  label: "Heading 4",
  command: (editor: Editor) =>
    editor?.chain().focus().setHeading({ level: 4 }).run(),
};

const HEADING5_BTN = {
  icon: <Heading5 size={SIZE} />,
  label: "Heading 5",
  command: (editor: Editor) =>
    editor?.chain().focus().setHeading({ level: 5 }).run(),
};

const HEADING6_BTN = {
  icon: <Heading6 size={SIZE} />,
  label: "Heading 6",
  command: (editor: Editor) =>
    editor?.chain().focus().setHeading({ level: 6 }).run(),
};

export const TOP_MENU_BUTTONS = [
  BOLD_BTN,
  ITALIC_BTN,
  STRIKETHROUGH_BTN,
  CODE_BTN,
  CODE_BLOCK_BTN,
  Separator,
  LINK_BTN,
  LIST_BTN,
  // NUMBERED_LIST_BTN,
];

export const BUBBLE_MENU_BUTTONS = [
  BOLD_BTN,
  ITALIC_BTN,
  STRIKETHROUGH_BTN,
  CODE_BTN,
  CODE_BLOCK_BTN,
  Separator,
  LINK_BTN,
  LIST_BTN,
  // NUMBERED_LIST_BTN,
];

export const MENU_TYPE_BUTTONS = [
  PARAGRAPH_BTN,
  HEADING2_BTN,
  HEADING3_BTN,
  HEADING4_BTN,
  HEADING5_BTN,
  HEADING6_BTN,
];

export const NEW_LINE_BUTTONS = [
  HEADING2_BTN,
  HEADING3_BTN,
  HEADING4_BTN,
  HEADING5_BTN,
  HEADING6_BTN,
];
