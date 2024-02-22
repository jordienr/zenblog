import { BubbleMenu, Editor, FloatingMenu } from "@tiptap/react";
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
import { NEW_LINE_BUTTONS, TOP_MENU_BUTTONS } from "./Editor.constants";

function EditorMenuButton({
  children,
  active,
  tooltip,
  ...props
}: {
  children: React.ReactNode;
  active: boolean;
  tooltip?: string;
} & React.ComponentPropsWithoutRef<"button">) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            tabIndex={-1}
            variant={"ghost"}
            type="button"
            className={cn(
              "rounded-md p-2 text-zinc-400",
              active ? "bg-zinc-100 text-zinc-800" : "text-zinc-400",
              props.disabled ? "" : "hover:bg-zinc-100/80 hover:text-zinc-600"
            )}
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}

export function EditorMenu({ editor }: { editor: Editor | null }) {
  const SIZE = 18;

  const Separator = {
    icon: <Dot size={SIZE} />,
    disabled: true,
    command: () => {},
  };

  const menuButtons: {
    icon: React.ReactNode;
    command: () => void;
    disabled?: boolean;
    tooltip?: string;
    active?: boolean;
  }[] = [
    {
      tooltip: "Bold (Cmd+B)",
      icon: <BoldIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive("bold"),
    },
    {
      tooltip: "Italic (Cmd+I)",
      icon: <ItalicIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive("italic"),
    },
    {
      tooltip: "Strikethrough",
      icon: <Strikethrough size={SIZE} />,
      command: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive("strike"),
    },
    {
      tooltip: "Code (Cmd+E)",
      icon: <CodeIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleCode().run(),
      active: editor?.isActive("code"),
    },
    {
      tooltip: "Code Block",
      icon: <PiCodeBlock size={SIZE} />,
      command: () => editor?.chain().focus().toggleCodeBlock().run(),
      active: editor?.isActive("codeBlock"),
    },
    Separator,
    {
      tooltip: "Link",
      icon: <Link size={SIZE} />,
      command: () => {
        const url = window.prompt("Enter the URL");
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
      active: editor?.isActive("link"),
    },
    {
      tooltip: "Bullet list",
      icon: <ListIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive("bulletList"),
    },
    {
      tooltip: "Numbered list",
      icon: <PiListNumbers size={SIZE} />,
      command: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive("orderedList"),
    },
  ];

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

  return (
    <div
      tabIndex={-1}
      className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm"
    >
      <DropdownMenu>
        <DropdownMenuTrigger tabIndex={-1} asChild>
          <Button variant={"ghost"} className="w-24 text-zinc-500">
            {editor?.isFocused ||
            editor?.isActive("paragraph") ||
            editor?.isActive("heading")
              ? editor.isActive("heading")
                ? `Heading ${editor.getAttributes("heading").level}`
                : "Paragraph"
              : "Type"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {menuTypeItems.map(({ icon, label, command }, i) => (
            <DropdownMenuItem
              className="flex gap-1.5"
              key={i + "menu-btn"}
              onClick={command}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {menuButtons.map(({ icon, command, disabled, tooltip, active }, i) => (
        <EditorMenuButton
          disabled={disabled}
          active={active || false}
          key={i + "menu-btn"}
          onClick={command}
          tooltip={tooltip}
        >
          {icon}
        </EditorMenuButton>
      ))}

      {editor && (
        <BubbleMenu
          className="flex items-center gap-0.5 rounded-xl bg-zinc-800 p-1.5 text-xs text-white shadow-md"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          {TOP_MENU_BUTTONS.map(({ icon, command, id }, i) => (
            <button
              className={cn("rounded-md p-1 text-xs text-white", {
                "hover:bg-zinc-600": !editor.isActive(id),
                "bg-zinc-600": editor.isActive(id),
              })}
              key={i + "menu-btn"}
              onClick={() => command(editor)}
            >
              {icon}
            </button>
          ))}
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
