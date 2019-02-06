const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    common: './src/js/common.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './webroot/js')
  },
  module: {
    rules: [{
        test: /\.js$/,
        // node_modules は除外する
        exclude: /node_modules/,
        use: {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2018 を ES5 に変換
                '@babel/preset-env',
              ]
            }

        },
    }]
  },
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name     : 'vendors',
  //     minChunks : Infinity
  //   })
  // ]
};
