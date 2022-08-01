/** @type {import('next').NextConfig} */

const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const pdfWorkerPath = require.resolve(`pdfjs-dist/build/pdf.worker.js`);

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};
// Overrides for css-loader plugin
function cssLoaderOptions(modules) {
  const { getLocalIdent, ...others } = modules; // Need to delete getLocalIdent else localIdentName doesn't work
  return {
    ...others,
    localIdentName: "[hash:base64:6]",
    exportLocalsConvention: "camelCaseOnly",
    mode: "local",
  };
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "localhost"],
  },
  webpack: config => {
    const oneOf = config.module.rules.find(
      rule => typeof rule.oneOf === "object"
    );
    if (oneOf) {
      // Find the module which targets *.scss|*.sass files
      const moduleSassRule = oneOf.oneOf.find(rule =>
        regexEqual(rule.test, /\.module\.(scss|sass|css)$/)
      );

      if (moduleSassRule) {
        // Get the config object for css-loader plugin
        const cssLoader = moduleSassRule.use.find(({ loader }) =>
          loader.includes("css-loader")
        );
        if (cssLoader) {
          cssLoader.options = {
            ...cssLoader.options,
            modules: cssLoaderOptions(cssLoader.options.modules),
          };
        }
      }
    }
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: pdfWorkerPath,
            to: path.join(__dirname, "public"),
          },
          {
            from: path.join(
              path.dirname(require.resolve("pdfjs-dist/package.json")),
              "cmaps"
            ),
            to: "cmaps/",
          },
        ],
      })
    );

    return config;
  },
};

module.exports = nextConfig;
