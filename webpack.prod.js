// @ts-check
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');

const sources = glob.sync('./src/**/*.{js,ts}').filter(item => !/\.d\.ts/.test(item))

const entries = sources.reduce((acc, item) => {
  const p = path.parse(item);
  acc[`${p.dir.replace('src/', '')}/${p.name}`]= item;
  return acc;
}, {});

const pages = Object.keys(entries).filter(item => !/utils/.test(entries[item])).map(item => {
  const p = path.parse(entries[item]);
  
  return new HtmlWebpackPlugin({
  template: './src/assets/template.html',
  chunks: [item],
  filename: `${item}.html`,
  
})})

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
