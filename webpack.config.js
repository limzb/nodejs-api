const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const StartServerPlugin = require('start-server-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: ['webpack/hot/poll?1000', './src/index'],
  watch: true,
  output: {
    path: path.resolve(__dirname, '.build'),
    filename: 'server.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  plugins: [
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TARGET: JSON.stringify('server'),
      },
    }),
    new Dotenv(),
  ],
};
