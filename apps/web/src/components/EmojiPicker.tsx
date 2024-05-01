import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

type Props = {
  onEmojiChange: (emoji: string) => void;
  emoji: string;
};
export function EmojiPicker({ emoji, onEmojiChange }: Props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [_emoji, setEmoji] = useState(emoji);

  const ref = useClickAway(() => {
    setShowEmojiPicker(false);
  });

  function onClick(e: any) {
    e.preventDefault();

    setShowEmojiPicker(!showEmojiPicker);
  }

  function _onEmojiChange(e: any) {
    setEmoji(e.native);
    onEmojiChange(e.native);
  }
  return (
    <div className="relative">
      <button
        className="h-11 w-11 rounded-full border text-2xl shadow-sm hover:border-orange-400"
        title="Toggle emoji picker"
        onClick={onClick}
      >
        {_emoji}
      </button>
      {showEmojiPicker && (
        <div ref={ref} className="absolute top-14 z-40">
          <Picker data={data} onEmojiSelect={_onEmojiChange} />
        </div>
      )}
    </div>
  );
}
