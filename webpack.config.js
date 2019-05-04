const path = require("path");

module.exports = {
  watch: true,

  target: "electron-renderer",

  entry: {
    app: ["webpack/hot/dev-server", "./src/client/main.jsx"]
  },

  output: {
    path: path.join(__dirname, "./public/built"),
    filename: "bundle.js",
    publicPath: "http://localhost:8080/built"
  },

  devServer: {
    contentBase: "./public",
    publicPath: "http://localhost:8080/built"
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.csm$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 2,
              sourceMap: true,
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: "style-loader"
          },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(?:png|jpg|svg)$/,
        loader: "url-loader"
      }
    ]
  }
};
