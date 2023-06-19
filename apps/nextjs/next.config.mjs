import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
   reactStrictMode: true,
   transpilePackages: ["@laundrey/api", "@laundrey/db"],
   experimental: {
      serverActions: true,
   },
   eslint: { ignoreDuringBuilds: true },
   typescript: { ignoreBuildErrors: true },
};

export default config;
