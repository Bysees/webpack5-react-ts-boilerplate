const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isDevServer = process.env.SERVER
const isAnalyze = process.env.ANALYZER

function cssModuleNames(loaderContext, _localIdentName, localName, options) {
  const request = path
    .relative(options.context || '', loaderContext.resourcePath)
    .replace(`src${path.sep}`, '')
    .replace('.module.css', '')
    .replace('.module.scss', '')
    .replace(/\\|\//g, '-')
    .replace(/\./g, '_')
    .split('-')
    .at(-1)
  return `${request}--${localName}`
}

function otherPlugins() {
  const plugins = []

  if (!isDev) {
    const miniCssExtract = new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })

    plugins.push(miniCssExtract)
  }

  if (isDevServer) {
    plugins.push(new ReactRefreshWebpackPlugin({ //? hot reload for React
      overlay: false,
    })) 
  }

  if (isAnalyze) {
    plugins.push(new BundleAnalyzerPlugin())
  }

  return plugins
}

/** @type {import('webpack').Configuration}*/

const config = {
  mode: isDev ? 'development' : 'production',
  target: isDev ? 'web' : 'browserslist',
  entry: path.resolve(__dirname,'./src/index.tsx'),

  output: {
    filename: isDev ? '[name].bundle.js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    assetModuleFilename: 'assets/[name][ext][query]',
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'public', 'favicon.ico'),
        to: path.resolve(__dirname, 'build')
      }]
    }),
    new ForkTsCheckerWebpackPlugin({ //? делает ПРОВЕРКУ типов в паралельном режиме
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),
    new ESLintWebpackPlugin({ //? Делает проверку eslint при билде/ребилде
      extensions: ['.js', '.ts', '.tsx']
    }),
    ...otherPlugins()
  ],

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // Использование кэша для избежания рекомпиляции при каждом запуске ()
          }
        },
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.s?css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // Run `postcss-loader` on each CSS `@import` and CSS modules/ICSS imports, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
              // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
              importLoaders: isDev ? 1 : 2,
              modules: {
                auto: /\.module\.\w+$/, //? отделяет module.css от обычного css. (вместо создания двух разных правил)
                getLocalIdent: cssModuleNames,
              }
            }
          },
          'postcss-loader',
          'sass-loader'
        ],
      },
      { test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i, type: 'asset/resource' },
      { test: /\.(woff(2)?|eot|ttf|otf)$/, type: 'asset' },
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      "@": path.resolve(__dirname, 'src/'),
    },
  },

  //? https://webpack.js.org/guides/caching/ - Про эти оптимизации
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimizer: [`...`, new CssMinimizerPlugin()]
  },

  devtool: isDev ? 'eval-cheap-module-source-map' : false,

  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    historyApiFallback: true, //? Возможно нужно для совместимости с react-router
    client: {
      logging: 'error',
      overlay: { //? Вывод ошибки на экран браузера
        warnings: false,
        errors: true
      }
    },
    compress: true, //? gzip'ит файлы (как я понял с этой опцией сервер работает быстрее)
    port: 3100,
    open: false
  }
}

module.exports = config