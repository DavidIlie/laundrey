/** @type {import('eslint').Linter.Config} */
const config = {
    root: true,
    extends: ["@laundrey/eslint-config/base", "@laundrey/eslint-config/react"],
    parserOptions: {
      project: "./tsconfig.json",
    },
  };
  
  module.exports = config;