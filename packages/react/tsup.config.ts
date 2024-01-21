import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  treeshake: true,
  sourcemap: "inline",
  minify: true,
  clean: true,
  dts: true,
  splitting: false,
  format: ["cjs", "esm"],
  external: ["react"],
  injectStyle: false,
  noExternal: [
    "@tiptap/extension-image",
    "@tiptap/pm",
    "@tiptap/react",
    "@tiptap/starter-kit",
    "react",
    "react-dom",
  ],
});
