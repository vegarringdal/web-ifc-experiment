import {
  clearFolders,
  addDefaultIndex,
  client,
  postcssPlugin,
  single,
  minifyHTMLLiteralsPlugin,
  copySync,
} from "esbuild-helpers";

clearFolders("dist");
copySync('node_modules/web-ifc/web-ifc.wasm', 'dist')

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(
  null,
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src/index.css"],
    outfile: "./dist/index.css",
    plugins: [
      postcssPlugin([require("tailwindcss")({
        purge: {
          enabled: true,
          content: ["./src/**/*.ts"],
        }
      })]),
    ],
    logLevel: "error",
    incremental: false,
  }
);

/**
 * client bundle
 */
client(
  null,
  {
    color: true,
    define: {
      DEVELOPMENT: "false",
    },
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    plugins: [minifyHTMLLiteralsPlugin()],
    minify: true,
    bundle: true,
    platform: "browser",
    sourcemap: false,
    logLevel: "error",
    incremental: false,
  }
);

/**
 * index file for project
 */
addDefaultIndex({
  publicFolders: [],
  hbr: false,
  distFolder: "dist",
  entry: "./index.js",
  indexTemplate: /*html*/ `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <link href="./index.css" rel="stylesheet" />
            <script src="./index.js"></script>
          </head>
          <body>
          <app-root></app-root>
          </body>
          </html>
          `,
});
