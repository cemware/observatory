const dotenv = require('dotenv').config({ path: '.env.production' });
if (dotenv.error) throw dotenv.error;

const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');


module.exports = merge.merge(common, {
  mode: 'production',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
    asyncChunks: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/css', to: 'css' },
        { from: 'public/font', to: 'font' },
        { from: 'public/images', to: 'images' },
        { from: 'public/wasm', to: 'wasm' },
        { from: 'public/data', to: 'data' },
        { from: 'public/i18n', to: 'i18n' },
        { from: 'public/license', to: 'license' },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../bundle-report.html',
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: true,
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
});