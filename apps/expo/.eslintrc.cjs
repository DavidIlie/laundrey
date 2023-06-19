/** @type {import('eslint').Linter.Config} */
const config = {
   root: true,
   extends: ["@laundrey/eslint-config/base", "@laundrey/eslint-config/react"],
   parserOptions: {
      project: "./tsconfig.json",
   },
   rules: {
      // TODO: Enable later when this app is implemented properly
      "@typescript-eslint/no-unused-vars": "off",
   },
};

module.exports = config;
