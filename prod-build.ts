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
copySync('node_modules/web-ifc/web-ifc.wasm', 'docs')

// helpers so ifcjs does not make esbuild think its nodejs only
const SkipPathAndFs = {
  name: 'skip-path-and-fs',
  setup(build: any) {
    let filter = /^(path)|(fs)/
    build.onResolve({ filter }, (args: any) => { return { path: args.path, external: true } })
  },
}


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
    outfile: "./docs/index.css",
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
    outfile: "./docs/index.js",
    plugins: [minifyHTMLLiteralsPlugin(),SkipPathAndFs],
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
  distFolder: "docs",
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
