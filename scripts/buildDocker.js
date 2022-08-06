/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { readFile, spawner, logInfo, logError } = require("./utils");

const buildDocker = async () => {
    let filePath = path.resolve(process.cwd(), `./package.json`);
    const packageJson = await readFile(filePath);
    const json = JSON.parse(packageJson);
    const name = "hub.docker.com/vegarringdal/web-ifc-3d";
    logInfo(`About to build: ${name}:${json.version}`, "green");

    const err = await spawner(
        "docker.exe",
        ["build", ".", "-t", `${name}:${json.version}`],
        process.cwd(),
        true
    );

    if (err) {
        logError(`\nNode app failed: ${err}\n`, "green");
    } else {
        logInfo(`Build done : ${name}:${json.version}`, "green");
    }
};
buildDocker();
