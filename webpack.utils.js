// @ts-check
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV } = process.env;

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
  development: (NODE_ENV === 'development'),
})});

module.exports = {
  entries,
  pages,
}