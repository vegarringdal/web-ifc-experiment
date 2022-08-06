module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    env: {
        browser: true,
        es2021: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto"
            }
        ]
    },
    settings: {
        react: {
            pragma: "React",
            version: "detect"
        }
    }
};
