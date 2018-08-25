const path = require('path');

const env = process.env.NODE_ENV;

const config = {
  mode: env || 'development',
  target: 'node',
  entry: {
    client: [path.resolve(__dirname, 'src/client.js')],
    server: [path.resolve(__dirname, 'src/server.js')],
  },
  output: {
    path: path.resolve(__dirname, './public/'),
    publicPath: './public/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};

module.exports = config;
