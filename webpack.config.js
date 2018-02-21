const path = require('path')

module.exports = (env = {}) => {
  const cfg = {
    entry: ['./index.js'],
    output: {
      path: path.resolve(__dirname, './pub/dist'),
      filename: 'woke.js'
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }]
    },
    plugins: [],
    externals: {
      _webpackconfig: {
        prod: false
      }
    }
  }

  if (env.prod === true) {
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
    cfg.plugins = cfg.plugins.concat([new UglifyJSPlugin()])
    cfg.externals._webpackconfig.prod = true
  } else {
    cfg.devServer = {
      contentBase: './pub'
    }
  }

  cfg.externals._webpackconfig = JSON.stringify(cfg.externals._webpackconfig)

  return cfg
}
