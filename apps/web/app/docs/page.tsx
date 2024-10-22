"use client";
import { useRouter } from "next/navigation";

export default function Docs() {
  const router = useRouter();

  router.push("/docs/getting-started");
  return <div></div>;
}
