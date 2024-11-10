"use client";

import { useEffect, useState } from "react";

export function useUrlAnchor() {
  const getHash = () =>
    typeof window !== "undefined"
      ? decodeURIComponent(window.location.hash)
      : "";
  const [hash, setHash] = useState(getHash());

  useEffect(() => {
    const onHashChange = () => {
      setHash(getHash());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}
