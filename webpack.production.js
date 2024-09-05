const { merge } = require("webpack-merge");
const webpackCommon = require("./webpack.config");
const { ESBuildPlugin, ESBuildMinifyPlugin } = require("esbuild-loader");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(webpackCommon, {
  mode: "production",
  devtool: "hidden-source-map",
  optimization: {
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true }, 
        },
      }),
      new CssMinimizerPlugin(),
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  plugins: [
    new ESBuildPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: "bundle-report.json",
    }),
  ],
});