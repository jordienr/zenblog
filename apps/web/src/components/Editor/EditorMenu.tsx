import { BubbleMenu, Editor } from "@tiptap/react";
import {
  BanIcon,
  ChevronDown,
  ExternalLink,
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
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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

  const link = editor?.getAttributes("link");

  useEffect(() => {
    editor?.chain().extendMarkRange("link").focus().run();
  }, [editor]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div tabIndex={-1} id="bubble-menu">
      {/** LINK EDITOR */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            appendTo: "parent",
            placement: "bottom",
          }}
          shouldShow={({ editor }) => {
            return editor.isActive("link");
          }}
          className="w-80 max-w-xs divide-y rounded-xl border bg-white shadow-sm"
        >
          <button
            className="flex w-full items-center gap-2 truncate p-2 font-mono text-xs"
            onClick={() => setShowForm(!showForm)}
          >
            <span className="w-full flex-grow truncate text-left">
              {link?.href}
            </span>
            {link?.target === "_blank" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ExternalLink
                      size={14}
                      className={cn("text-slate-400", {
                        "text-blue-500": link?.target === "_blank",
                      })}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Opens in new tab</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {link?.rel?.includes("nofollow") && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BanIcon
                      size={14}
                      className={cn("text-slate-400", {
                        "text-red-500": link?.rel?.includes("nofollow"),
                      })}
                    />
                  </TooltipTrigger>
                  <TooltipContent>No follow</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <ChevronDown
              className={cn("", { "rotate-180": showForm })}
              size={14}
            />
          </button>
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 p-2"
              >
                <div className="flex flex-col gap-1">
                  <Label>URL</Label>
                  <Input
                    defaultValue={link?.href}
                    value={link?.href}
                    type="url"
                    name="url"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0 font-mono"
                    onChange={(e) => {
                      editor
                        ?.chain()
                        .extendMarkRange("link")
                        .updateAttributes("link", {
                          href: e.target.value,
                          target: link?.target || "_self",
                          rel: link?.rel?.includes("nofollow")
                            ? "noopener noreferrer nofollow"
                            : "noopener noreferrer",
                        })
                        .run();
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="open-in-new-tab"
                    name="open-in-new-tab"
                    checked={link?.target === "_blank"}
                    onCheckedChange={(checked) => {
                      editor
                        ?.chain()
                        .extendMarkRange("link")
                        .updateAttributes("link", {
                          href: link?.href,
                          target: checked ? "_blank" : "_self",
                          rel: link?.rel?.includes("nofollow")
                            ? "noopener noreferrer nofollow"
                            : "noopener noreferrer",
                        })
                        .run();
                    }}
                  />
                  <Label className="p-1.5" htmlFor="open-in-new-tab">
                    Open in new tab
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="no-follow"
                    name="no-follow"
                    checked={link?.rel?.includes("nofollow")}
                    onCheckedChange={(checked) => {
                      editor
                        ?.chain()
                        .extendMarkRange("link")
                        .updateAttributes("link", {
                          href: link?.href,
                          target: link?.target || "_self",
                          rel: checked
                            ? "noopener noreferrer nofollow"
                            : "noopener noreferrer",
                        })
                        .run();
                    }}
                  />
                  <Label className="p-1.5" htmlFor="no-follow">
                    No follow
                  </Label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </BubbleMenu>
      )}
      {/** BUBBLE EDITOR */}
      {editor && (
        <BubbleMenu
          className="flex items-center gap-1 rounded-xl bg-zinc-800 p-1 text-xs text-white shadow-md"
          tippyOptions={{
            duration: 100,
            appendTo: "parent",
          }}
          editor={editor}
          shouldShow={({ editor }) => {
            if (editor.isActive("image")) return false;
            if (editor.isActive("link")) return false;

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
