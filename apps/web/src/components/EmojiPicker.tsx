import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
  onEmojiChange: (emoji: string) => void;
  emoji: string;
};
export function EmojiPicker({ emoji, onEmojiChange }: Props) {
  const [_emoji, setEmoji] = useState(emoji);

  function _onEmojiChange(e: any) {
    setEmoji(e.native);
    onEmojiChange(e.native);
  }
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-xl shadow-sm hover:border-orange-400"
            title="Toggle emoji picker"
          >
            {_emoji}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-full bg-none p-0">
          <Picker data={data} onEmojiSelect={_onEmojiChange} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
