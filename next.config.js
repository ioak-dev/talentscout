const path = require("path");

module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
  trailingSlash: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  // output: "export",
  // reactStrictMode: false
};
