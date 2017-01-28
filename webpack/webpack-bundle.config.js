
var webpack = require('webpack');
require('es6-promise').polyfill();

var npm = require("../package.json");

module.exports = {

  entry: __dirname + '/../src/index.js',

  output: {
    path: __dirname + '/../dist/',
    publicPath: '../dist/',
    filename: 'vue-testing.js',
    libraryTarget: "umd",
    library: "VueTesting"
  },

  externals: {
    "Vue": "vue"
  },

  module: {

    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
    ]
  },

  plugins: [

    new webpack.BannerPlugin((
      [
        "Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)",
        "\n",
        "Licensed Under MIT (http://opensource.org/licenses/MIT)",
        "\n",
        "\n",
        "Vue Testing @ Version "+ npm.version,
        "\n"
      ])
      .join("")),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),

  ]

};
