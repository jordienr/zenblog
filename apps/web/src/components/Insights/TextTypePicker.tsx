import React, { useMemo } from "react";
import { TextType, TextTypes } from "@/lib/ai/insights";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";

type Props = {
  onTextTypeChange: (textType: TextType) => void;
};

const TextTypePicker = (props: Props) => {
  const [selectedTextTypeVal, setSelectedTextType] =
    React.useState<TextType>("blog_post");

  const selectedTextType = useMemo(() => {
    return TextTypes[selectedTextTypeVal];
  }, [selectedTextTypeVal]);

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="flex w-full flex-col items-start justify-start rounded-xl border bg-white px-4 py-1 shadow-sm">
          <Label htmlFor="text-type">Text type</Label>
          <div className="font-mono font-medium">
            <span className="text-2xl">{selectedTextType.emoji}</span>{" "}
            <span>{selectedTextType.title}</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="text-left font-sans">
          {Object.keys(TextTypes).map((typeKey) => {
            const textType = TextTypes[typeKey as keyof typeof TextTypes];
            return (
              <button
                onClick={() =>
                  setSelectedTextType(typeKey as keyof typeof TextTypes)
                }
                key={typeKey}
                className="flex items-center gap-4 rounded-lg px-4 py-2 hover:bg-slate-100"
              >
                <span className="text-3xl">{textType.emoji}</span>
                <div className="flex flex-col text-left">
                  <span className="font-medium">{textType.title}</span>
                  <span className="text-sm text-slate-600">
                    {textType.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TextTypePicker;
