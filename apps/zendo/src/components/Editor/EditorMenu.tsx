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
            variant={"ghost"}
            tabIndex={-1}
            type="button"
            className={cn(
              "rounded-md p-2 text-zinc-400",
              active ? "text-zinc-500" : "",
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

  function getOSMetaKey() {
    const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
    return isMac ? "Cmd" : "Ctrl";
  }

  function getMenuTooltip(command: string) {
    const key = getOSMetaKey();
    return command.replace("Meta", key);
  }

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
  }[] = [
    {
      tooltip: getMenuTooltip("Bold (Meta+B)"),
      icon: <BoldIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      tooltip: getMenuTooltip("Italic (Meta+I)"),
      icon: <ItalicIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      tooltip: getMenuTooltip("Strikethrough"),
      icon: <Strikethrough size={SIZE} />,
      command: () => editor?.chain().focus().toggleStrike().run(),
    },
    {
      tooltip: getMenuTooltip("Code (Meta+E)"),
      icon: <CodeIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleCode().run(),
    },
    {
      tooltip: getMenuTooltip("Code Block"),
      icon: <PiCodeBlock size={SIZE} />,
      command: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
    Separator,
    {
      tooltip: getMenuTooltip("Link"),
      icon: <Link size={SIZE} />,
      command: () => {
        const url = window.prompt("Enter the URL");
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
    },
    {
      tooltip: getMenuTooltip("List"),
      icon: <ListIcon size={SIZE} />,
      command: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      tooltip: getMenuTooltip("Numbered List"),
      icon: <PiListNumbers size={SIZE} />,
      command: () => editor?.chain().focus().toggleOrderedList().run(),
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
    <div className="flex rounded-lg border border-zinc-200 bg-white p-1 shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"} className="w-24 text-zinc-500">
            {editor?.isFocused ||
            editor?.isActive("paragraph") ||
            editor?.isActive("heading")
              ? editor.isActive("heading")
                ? "Heading"
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
      {menuButtons.map(({ icon, command, disabled, tooltip }, i) => (
        <EditorMenuButton
          disabled={disabled}
          active={editor?.isActive(command) || false}
          key={i + "menu-btn"}
          onClick={command}
          tooltip={tooltip}
        >
          {icon}
        </EditorMenuButton>
      ))}
    </div>
  );
}
