/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
   arrowParens: "always",
   printWidth: 80,
   singleQuote: false,
   jsxSingleQuote: false,
   semi: true,
   trailingComma: "all",
   tabWidth: 3,
   plugins: [
      "@ianvs/prettier-plugin-sort-imports",
      "prettier-plugin-tailwindcss",
   ],
   tailwindConfig: "./packages/config/tailwind",
   importOrderTypeScriptVersion: "4.4.0",
   importOrder: [
      "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
      "^(next/(.*)$)|^(next$)",
      "<THIRD_PARTY_MODULES>",
      "",
      "^~/trpc/(.*)$",
      "~/env.mjs",
      "^~/lib/(.*)$",
      "^~/data/(.*)$",
      "^~/hooks/(.*)$",
      "",
      "^@laundrey/(.*)$",
      "",
      "^~/components/(.*)$",
      "^~/(.*)$",
      "^[./]",
   ],
};

module.exports = config;
