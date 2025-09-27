import { motion } from "framer-motion";

export function BrowserWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full rounded-lg border border-slate-300 bg-slate-100 p-2">
      <div className="hidden items-center gap-2 px-1 pb-2 md:flex">
        {new Array(3).fill(0).map((v, idx) => (
          <span
            key={`dot-${idx}`}
            className="block size-3 rounded-full border border-slate-300"
          ></span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-full overflow-hidden rounded-md border border-slate-300 bg-slate-50 md:min-h-[600px]"
      >
        {children}
      </motion.div>
    </div>
  );
}
