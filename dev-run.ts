import {
  clearFolders,
  addDefaultIndex,
  client,
  postcssPlugin,
  single,
  TypeChecker
} from "esbuild-helpers";

clearFolders("dist");

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(
  { watch: "./src/**/*.css" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src/index.css"],
    outfile: "./dist/index.css",
    plugins: [postcssPlugin([require("tailwindcss")({
      purge: {
        enabled: false,
        content: ["./src/**/*.ts"],
      }
    })])],
    logLevel: "error",
    incremental: true,
  }
).then(() => {

  // post css is a little slow, so wait for it the first time

  /**
   * client bundle
   */
  client(
    { watch: "./src/**/*.ts" },
    {
      color: true,
      define: {
        DEVELOPMENT: "true",
      },
      entryPoints: ["./src/index.ts"],
      outfile: "./dist/index.js",
      minify: false,
      bundle: true,
      platform: "browser",
      sourcemap: true,
      logLevel: "error",
      incremental: true,
    }
  );
})



/**
 * index file for project
 */
addDefaultIndex({
  publicFolders: [],
  distFolder: "dist",
  entry: "./index.js",
  hbr: true,
  devServer: true,
  devServerPort: 80,
  userInjectOnHbr:
    // I just want it to reload on saves..
    'window.location.reload()',
  indexTemplate: /*html*/ `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <link href="./index.css" rel="stylesheet" />
          $bundle
        </head>
        <body>
          <app-root></app-root>
        </body>
        </html>
        `,
});


const checker_client = TypeChecker({
  basePath: `./src`,
  name: 'client type check',
  tsConfig: 'tsconfig.json'
});

checker_client.printSettings();
checker_client.inspectAndPrint();
checker_client.worker_watch(['./']);