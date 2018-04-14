// https://webpack.js.org/guides/production/

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

var main = merge(common.main, {
  mode: 'development'
})

var renderer = merge(common.renderer, {
  mode: 'development'
})

module.exports = [main, renderer];
