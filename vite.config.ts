import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
    if (command === "serve") {
        return {
            publicDir: "../public",
            root: "./src",
            define: {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                VERSION_WEB_3d: `"${require("./package.json").version}"`
            },
            plugins: [react()],
            server: {
                port: 1080,
                watch: {
                    ignored: ["!**../models**", "!**../target**"]
                }
            },
            build: {
                emptyOutDir: true,
                outDir: "../dist"
            }
        };
    } else {
        // command === 'build'
        return {
            root: "./src",
            define: {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                VERSION_WEB_3d: `"${require("./package.json").version}"`
            },
            plugins: [react()],
            build: {
                emptyOutDir: true,
                outDir: "../dist"
            }
        };
    }
});
