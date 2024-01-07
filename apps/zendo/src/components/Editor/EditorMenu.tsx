import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  Image,
  ItalicIcon,
  Strikethrough,
} from "lucide-react";
import { PiCodeBlock } from "react-icons/pi";
import { ImagePicker } from "../Images/ImagePicker";

function EditorMenuButton({
  children,
  active,
  ...props
}: {
  children: React.ReactNode;
  active: boolean;
} & React.ComponentPropsWithoutRef<"button">) {
  const className = `p-2 rounded-md hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 ${
    active ? "text-orange-500" : ""
  }`;

  return (
    <button tabIndex={-1} type="button" className={className} {...props}>
      {children}
    </button>
  );
}

export function EditorMenu({ editor }: { editor: Editor | null }) {
  const SIZE = 18;
  const menuButtons = [
    {
      icon: <BoldIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      icon: <ItalicIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      icon: <Strikethrough size={SIZE} />,
      command: () => editor?.chain().focus().toggleStrike().run(),
    },
    {
      icon: <CodeIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleCode().run(),
    },
    {
      icon: <PiCodeBlock size={SIZE} />,
      command: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div className="flex rounded-2xl bg-white p-1">
      {menuButtons.map(({ icon, command }, i) => (
        <EditorMenuButton
          active={editor?.isActive(command) || false}
          key={i}
          onClick={() => command()}
        >
          {icon}
        </EditorMenuButton>
      ))}
    </div>
  );
}
