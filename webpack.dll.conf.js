const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    vendor: [
      "apollo-cache-inmemory",
      "apollo-client",
      "apollo-link",
      "apollo-link-error",
      "apollo-link-http",
      "graphql",
      "graphql-tag",
      "store",
      "unfetch",
      "vue-apollo",
      "vue-bem-cn",
      "vue-gemini-scrollbar"
    ]
  },
  output: {
    path: path.join(__dirname, "public/vendor"),
    filename: "[name].dll.js",
    library: "[name]_[hash]" // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "public/vendor", "[name]-manifest.json"),
      name: "[name]_[hash]",
      context: process.cwd()
    })
  ]
};
