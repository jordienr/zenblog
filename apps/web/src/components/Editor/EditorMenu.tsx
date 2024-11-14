import { BubbleMenu, Editor } from "@tiptap/react";
import {
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TOP_MENU_BUTTONS } from "./Editor.constants";
import Tippy from "@tippyjs/react";
import { useState } from "react";

export function EditorMenu({ editor }: { editor: Editor | null }) {
  const SIZE = 14;

  const menuTypeItems = [
    {
      icon: <Pilcrow size={SIZE} />,
      label: "Paragraph",
      command: () => editor?.chain().focus().setParagraph().run(),
    },
    {
      icon: <Heading2 size={SIZE} />,
      label: "Heading 2",
      command: () => editor?.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      icon: <Heading3 size={SIZE} />,
      label: "Heading 3",
      command: () => editor?.chain().focus().setHeading({ level: 3 }).run(),
    },
    {
      icon: <Heading4 size={SIZE} />,
      label: "Heading 4",
      command: () => editor?.chain().focus().setHeading({ level: 4 }).run(),
    },
    {
      icon: <Heading5 size={SIZE} />,
      label: "Heading 5",
      command: () => editor?.chain().focus().setHeading({ level: 5 }).run(),
    },
    {
      icon: <Heading6 size={SIZE} />,
      label: "Heading 6",
      command: () => editor?.chain().focus().setHeading({ level: 6 }).run(),
    },
  ];

  const [showTextTypeMenu, setShowTextTypeMenu] = useState(false);

  return (
    <div tabIndex={-1} id="bubble-menu">
      {editor && (
        <BubbleMenu
          className="flex items-center gap-1 rounded-xl bg-zinc-800 p-1 text-xs text-white shadow-md"
          tippyOptions={{
            duration: 100,
            appendTo: "parent",
          }}
          editor={editor}
          shouldShow={({ editor }) => {
            // if its in an image, do not show
            if (editor.isActive("image")) return false;

            // if the user has something selected, show
            if (editor.view.state.selection.content().size) return true;
            // otherwise, only show if the cursor is in the last paragraph
            return false;
          }}
        >
          <Tippy
            interactive={true}
            appendTo={"parent"}
            placement="bottom"
            visible={showTextTypeMenu}
            content={
              <div className="rounded-xl bg-zinc-800 p-1 text-zinc-50">
                {menuTypeItems.map(({ icon, label, command }, i) => (
                  <button
                    className="flex cursor-pointer gap-1 rounded-lg p-1.5 hover:bg-zinc-700"
                    key={i + "menu-btn"}
                    onClick={() => {
                      command();
                      setShowTextTypeMenu(false);
                    }}
                  >
                    <span className="px-1 text-zinc-300">{icon}</span>
                    <span className="pr-2">{label}</span>
                  </button>
                ))}
              </div>
            }
          >
            <button
              className="h-full w-20 py-[6px] font-mono"
              onClick={() => {
                setShowTextTypeMenu(!showTextTypeMenu);
              }}
            >
              {editor?.isFocused ||
              editor?.isActive("paragraph") ||
              editor?.isActive("heading")
                ? editor.isActive("heading")
                  ? `Heading ${editor.getAttributes("heading").level}`
                  : "Paragraph"
                : "Type"}
            </button>
          </Tippy>
          {TOP_MENU_BUTTONS.map(
            ({ icon, command, id }, i) =>
              id !== "separator" && (
                <button
                  className={cn("rounded-lg p-1.5 text-xs text-white", {
                    "hover:bg-zinc-700": !editor.isActive(id),
                    "bg-zinc-600": editor.isActive(id),
                  })}
                  key={i + "menu-btn"}
                  onClick={() => command(editor)}
                >
                  {icon}
                </button>
              )
          )}
        </BubbleMenu>
      )}
    </div>
  );
}
