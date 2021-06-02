  
module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
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
    }
};