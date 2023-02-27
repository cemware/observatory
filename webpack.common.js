const path = require('path');
const webpack = require('webpack');
const packageJSON = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

/** @type { webpack.Configuration } */
module.exports = {
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    fallback: { path: false, fs: false },
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
          },
        },
      },
      {
        type: 'asset/resource',
        test: /\.(png|jpg|svg)$/i,
      },
      {
        test: /\.(ini|txt)$/i,
        loader: "raw-loader",
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VERSION': JSON.stringify(packageJSON.version),
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: 'public/favicon.ico',
      template: 'public/index.ejs',
      templateParameters: {
        url: process.env.META_URL || '',
        title: process.env.META_TITLE || '',
        desc: process.env.META_DESC || '',
        keyword: process.env.META_KEYWORD || '',
        img: process.env.META_IMG || '',
      },
      minify: {
        minifyJS: true,
        minifyCSS: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
      },
    }),
    new ForkTsCheckerPlugin(),
  ],

  optimization: {
    minimize: false,
  },
};
