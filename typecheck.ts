import { TypeChecker } from "esbuild-helpers";

const checker_client = TypeChecker({
    basePath: `./src`,
    name: "client type check",
    tsConfig: "tsconfig.json",
    throwOnSemantic: true,
    throwOnSyntactic: true
});

checker_client.printSettings();
checker_client.inspectAndPrint();

