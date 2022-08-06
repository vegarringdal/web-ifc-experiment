module.exports = {
    /*    preset: "ts-jest", */
    testEnvironment: "jsdom",
    clearMocks: true,
    maxConcurrency: 1,
    /* coverageProvider: "v8", */
    setupFilesAfterEnv: ["<rootDir>/jest/jest.setup.js"],
    collectCoverageFrom: [],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
        "^.+\\.svg$": "<rootDir>/jest/svgTransform.js",
        "^.+\\.css$": "<rootDir>/jest/cssTransform.js"
    },
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/jest/tsconfig.jest.json",
            diagnostics: false
        }
    }
};
