"use client";
import { useRouter } from "next/navigation";

const Docs = () => {
  const router = useRouter();
  router.push("/docs/getting-started");
};

export default Docs;
