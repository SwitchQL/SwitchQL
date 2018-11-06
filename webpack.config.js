const webpack = require('webpack');
const path = require('path');

module.exports = {
  watch: true,
  
  target: 'electron-renderer',

  entry: {
    app: ['webpack/hot/dev-server', './src/client/main.jsx']
  },

  output: {
    path: path.join(__dirname, './public/built'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/built/'
  },

  devServer: {
    contentBase: './public',
    publicPath: 'http://localhost:8080/built'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules:true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash: base64]',
              sourceMap: true,
              minimize: true,
            },
          },
        ],
      },
    ],
  },
}