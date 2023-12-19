const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry points of your application
  entry: {
    main: './frontend/src/scripts/main.js',
    detailed: './frontend/src/scripts/detailed_visualization/scripts_for_detailed.js',
  },

  // Output configuration for Webpack
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './frontend/dist'),
    publicPath: '/',
  },

  // Mode can be 'development' or 'production'
  mode: 'development',

  // Configuration for the dev server
  devServer: {
    static: {
      directory: path.join(__dirname, './frontend/dist'),
      publicPath: '/',
      serveIndex: true,
      watch: true,
    },
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: {
      index: '/index.html',
    },
  },

  // Module rules for handling different file types
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add more rules as needed
    ],
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './frontend/src/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './frontend/src/templates/visualization.html',
      filename: 'visualization.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './frontend/src/templates/detailed_visualization.html',
      filename: 'detailed_visualization.html',
      chunks: ['detailed'],
    }),
  ],
};
