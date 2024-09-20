import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {languageOptions: {globals: globals.browser}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-undef": "off",
            "quotes": ["error", "double"],
            "no-console": [
                "error",
                {
                    "allow": ["debug", "warn", "error", "info"]
                }
            ],
            "@typescript-eslint/no-unsafe-function-type": "off",
            "no-throw-literal": "off",
        }
    }
];