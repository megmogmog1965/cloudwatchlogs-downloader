// https://webpack.js.org/guides/production/

const path = require('path');

var main = () => ({
  target: 'electron-main',
  devtool: 'inline-source-map',
  entry: './src/main/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: modules
})

var renderer = () => ({
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  entry: './src/renderer/index.tsx',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: modules
})

var modules = {
  rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      options: { /* Loader options go here */ }
    },
    {
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre'
    }
  ]
}

module.exports = {
  main: main(),
  renderer: renderer()
}
