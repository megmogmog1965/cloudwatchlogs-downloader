// https://webpack.js.org/guides/production/

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

var main = merge(common.main, {
  mode: 'production'
})

var renderer = merge(common.renderer, {
  mode: 'production'
})

module.exports = [main, renderer];
