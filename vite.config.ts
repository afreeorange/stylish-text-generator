import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [preact()],
    base: mode === "production" ? "/text-generator" : "",

    /**
     * NOTE: Assuming the latest and greatest here since I'm the only person who
     * uses this thing...
     *
     * https://github.com/vitejs/vite/issues/6985
     */
    build: {
      target: "esnext",

      /**
       * If you want a single JS file...
       * https://github.com/vitejs/vite/discussions/2739#discussioncomment-685028
       */
      rollupOptions: {
        output: {
          manualChunks: false,
          inlineDynamicImports: true,
          entryFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
  };
});
