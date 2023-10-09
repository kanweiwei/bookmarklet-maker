/** @type {import('next').NextConfig} */
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const nextConfig = {
  outputFileTracing: false,
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ["javascript", "typescript"],
        filename: "static/[name].worker.js",
      })
    );

    return config;
  },
};

module.exports = nextConfig;
