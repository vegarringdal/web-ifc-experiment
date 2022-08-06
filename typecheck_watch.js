// eslint-disable-next-line @typescript-eslint/no-var-requires
const helpers = require("esbuild-helpers");

const frontend = helpers.TypeChecker({
    basePath: "./",
    name: "checker_frontend",
    shortenFilenames: false,
    tsConfig: "./tsconfig.json"
});

frontend.printSettings();
frontend.inspectAndPrint();
frontend.worker_watch(["./src"]);
