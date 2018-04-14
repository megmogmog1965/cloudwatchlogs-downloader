// https://webpack.js.org/guides/production/

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

var main = merge(common.main, {
})

var renderer = merge(common.renderer, {
})

module.exports = [main, renderer];
