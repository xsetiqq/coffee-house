import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        menu: resolve(__dirname, "menu.html"),
        card: resolve(__dirname, "card.html"),
        signin: resolve(__dirname, "signin.html"),
        register: resolve(__dirname, "register.html"),
      },
    },
  },
});
