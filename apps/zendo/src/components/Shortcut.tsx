type Props = {
  shortcut: string;
};
export default function Shortcut({ shortcut }: Props) {
  const keys = shortcut.split(" ");

  const formattedKeys = keys.map((k) => {
    if (k === "cmd") return "⌘";
    if (k === "ctrl") return "⌃";
    if (k === "alt") return "⌥";
    if (k === "shift") return "⇧";
    return k.toUpperCase();
  });

  return (
    <div className="flex gap-0.5 text-xs">
      {formattedKeys.map((k, i) => (
        <div
          key={i}
          className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-200/30 drop-shadow-md"
        >
          {k}
        </div>
      ))}
    </div>
  );
}
