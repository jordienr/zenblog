"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SocialLinks({
  links,
  className,
  linkClassName,
}: {
  links: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  className?: string;
  linkClassName?: string;
}) {
  const allAreEmpty = !links.twitter && !links.instagram && !links.website;

  if (allAreEmpty) {
    return null;
  }

  const baseLinkClassName =
    "px-2 py-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all rounded-lg hover:cursor-default";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("flex gap-1 font-mono text-gray-500", className)}
    >
      {links.website && (
        <a
          className={cn(baseLinkClassName, linkClassName)}
          target="_blank"
          href={links.website}
        >
          Website
        </a>
      )}
      {links.twitter && (
        <a
          className={cn(baseLinkClassName, linkClassName)}
          target="_blank"
          href={links.twitter}
        >
          Twitter
        </a>
      )}
      {links.instagram && (
        <a
          className={cn(baseLinkClassName, linkClassName)}
          target="_blank"
          href={links.instagram}
        >
          Instagram
        </a>
      )}
    </motion.nav>
  );
}
