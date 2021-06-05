import {
    clearFolders,
    addDefaultIndex,
    client,
    postcssPlugin,
    single,
    TypeChecker,
    copySync
} from "esbuild-helpers";

clearFolders("dist");
copySync("node_modules/web-ifc/web-ifc.wasm", "dist");

// helpers so ifcjs does not make esbuild think its nodejs only
const SkipPathAndFs = {
    name: "skip-path-and-fs",
    setup(build: any) {
        const filter = /^(path)|(fs)/;
        build.onResolve({ filter }, (args: any) => {
            return { path: args.path, external: true };
        });
    }
};

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(
    { watch: "./src/**/*.css" },
    {
        color: true,
        define: {
            DEVELOPMENT: "true"
        },
        entryPoints: ["./src/index.css"],
        outfile: "./dist/index.css",
        plugins: [
            postcssPlugin([
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require("tailwindcss")({
                    purge: {
                        enabled: false,
                        content: ["./src/**/*.ts"]
                    }
                })
            ])
        ],
        logLevel: "error",
        incremental: true
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
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                VERSION: `"${require("./package-lock.json").version}"`
            },
            entryPoints: ["./src/index.ts"],
            outfile: "./dist/index.js",
            minify: false,
            bundle: true,
            platform: "browser",
            plugins: [SkipPathAndFs],
            sourcemap: true,
            logLevel: "error",
            incremental: true
        }
    );
});

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
        "window.location.reload()",
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
        `
});

const checker_client = TypeChecker({
    basePath: `./src`,
    name: "client type check",
    tsConfig: "tsconfig.json"
});

checker_client.printSettings();
checker_client.inspectAndPrint();
checker_client.worker_watch(["./"]);
