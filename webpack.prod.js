// @ts-check
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const { entries, pages } = require('./webpack.utils');

const { NODE_ENV } = process.env;

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  entry: entries,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options:{
            transpileOnly: true,
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
            loader: 'url-loader',
        }
      }

    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      }
    }),
    ...pages,
  ],
  optimization: {
    minimizer: [new UglifyJsWebpackPlugin()],
    concatenateModules: true,
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
