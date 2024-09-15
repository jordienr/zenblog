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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { TOP_MENU_BUTTONS } from "./Editor.constants";
import Tippy from "@tippyjs/react";
import { useRef, useState } from "react";

// function EditorMenuButton({
//   children,
//   active,
//   tooltip,
//   ...props
// }: {
//   children: React.ReactNode;
//   active: boolean;
//   tooltip?: string;
// } & React.ComponentPropsWithoutRef<"button">) {
//   return (
//     <TooltipProvider>
//       <Tooltip delayDuration={250}>
//         <TooltipTrigger asChild>
//           <Button
//             tabIndex={-1}
//             variant={"ghost"}
//             type="button"
//             className={cn(
//               "rounded-md p-2 text-zinc-400",
//               active ? "bg-zinc-100 text-zinc-800" : "text-zinc-400",
//               props.disabled ? "" : "hover:bg-zinc-100/80 hover:text-zinc-600"
//             )}
//             {...props}
//           >
//             {children}
//           </Button>
//         </TooltipTrigger>
//         {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
//       </Tooltip>
//     </TooltipProvider>
//   );
// }

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
          {/* <DropdownMenu>
            <DropdownMenuTrigger tabIndex={-1} asChild>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {menuTypeItems.map(({ icon, label, command }, i) => (
                <DropdownMenuItem
                  className="flex gap-1"
                  key={i + "menu-btn"}
                  onClick={command}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
          {/* {menuButtons.map(
            ({ icon, command, disabled, tooltip, active }, i) => (
              <EditorMenuButton
                disabled={disabled}
                active={active || false}
                key={i + "menu-btn"}
                onClick={command}
                tooltip={tooltip}
              >
                {icon}
              </EditorMenuButton>
            )
          )} */}
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

      {/* {editor && (
        <FloatingMenu
          className="rounded-md bg-zinc-50 p-0.5"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          {NEW_LINE_BUTTONS.map((item) => {
            const { icon, label, command } = item;
            return (
              <button
                key={label}
                onClick={() => command(editor)}
                className="rounded-md p-0.5 text-xs text-zinc-400 "
              >
                {icon}
              </button>
            );
          })}
        </FloatingMenu>
      )} */}
    </div>
  );
}
