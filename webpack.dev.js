// @ts-check
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const sources = glob.sync('./src/**/*.{ts,js}')

const entries = sources.reduce((acc, item) => {
  const p = path.parse(item);
  acc[`${p.name}${p.ext}`]= item;
  return acc;
}, {});

const pages = Object.keys(entries).filter(item => !/utils/.test(entries[item])).map(item => {
  console.log(item)
  const p = path.parse(entries[item]);
  const outDir = p.dir.split(path.sep).slice(2).join(path.sep)
  
  return new HtmlWebpackPlugin({
  template: './src/assets/template.html',
  chunks: [item],
  filename: `${outDir}/${p.name}.html`,
})})

module.exports = {
  mode: 'development',
  entry: entries,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    ...pages,
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
