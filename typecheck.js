// eslint-disable-next-line @typescript-eslint/no-var-requires
const helpers = require("esbuild-helpers");

const frontend = helpers.TypeChecker({
    basePath: "./",
    name: "checker_frontend",
    tsConfig: "./tsconfig.json",
    throwOnSemantic: true,
    throwOnSyntactic: true
});

frontend.printSettings();
frontend.inspectAndPrint();
