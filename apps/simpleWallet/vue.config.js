const { defineConfig } = require("@vue/cli-service");
const NodePolyfillWebpackPlugin = require("node-polyfill-webpack-plugin");
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
module.exports = defineConfig({
  devServer: {
    port: 3000,
  },
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: "./",
  configureWebpack: {
    plugins: [
      new NodePolyfillWebpackPlugin(),
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
});
