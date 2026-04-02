"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export function FadeIn({
  children,
  delay,
}: PropsWithChildren<{
  delay?: number;
}>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay || 0 }}
    >
      {children}
    </motion.div>
  );
}
