import { useEffect } from "react";

type Key = "ctrl" | "shift" | "alt" | string;

export const useKeyboardShortcut = (keys: Key[], callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("keys", keys, callback);
      if (
        keys.every(
          (key) =>
            (key === "ctrl" && event.ctrlKey) ||
            (key === "shift" && event.shiftKey) ||
            (key === "alt" && event.altKey) ||
            (key === "cmd" && event.metaKey) ||
            (typeof key === "string" && event.key.toLowerCase() === key)
        )
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};
