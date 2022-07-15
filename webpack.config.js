const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
  DuplicateReporterPlugin,
} = require('duplicate-dependencies-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.REACT_APP_NODE_ENV !== 'production';

console.log('devMode', devMode);

module.exports = () => {
  return {
    context: path.join(__dirname, '/src'),
    entry: {
      app: { import: './index.tsx', dependOn: 'react-vendors' },
      'react-vendors': [
        'react',
        'react-dom',
        'react-router-dom',
        'react-redux',
        'redux',
      ],
    },
    target: 'web',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].bundle.js',
      publicPath: '/',
      clean: true,
    },
    devServer: {
      static: './public',
      port: 3000,
      liveReload: true,
      hot: true,
      historyApiFallback: {
        index: '/',
      },
    },
    watchOptions: {
      ignored: ['**/node_modules', '**/dist', '**/.git'],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.jsx'],
      modules: ['node_modules', path.resolve(__dirname, 'src')],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            devMode ? 'style-loader' : { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { importLoaders: 2 } },
            'postcss-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            devMode ? 'style-loader' : { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: 2,
              },
            },
            { loader: 'postcss-loader' },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          exclude: /node_modules/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        minify: devMode
          ? {}
          : {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_APIKEY': JSON.stringify(
          'AIzaSyAHFz7EWTsukfWQxBxmoilBfbfbHgJgbSw'
        ),
        'process.env.REACT_APP_AUTHDOMAIN': JSON.stringify(
          'booking-calendar-d63cb.firebaseapp.com'
        ),
        'process.env.REACT_APP_PROJECTID': JSON.stringify(
          'booking-calendar-d63cb'
        ),
        'process.env.REACT_APP_STORAGE_BUCKET': JSON.stringify(
          'booking-calendar-d63cb.appspot.com'
        ),
        'process.env.REACT_APP_MESSAGING_SENDER_ID':
          JSON.stringify('463988129681'),
        'process.env.REACT_APP_APP_ID': JSON.stringify(
          '1:463988129681:web:821fa9037e9d77e4d9e430'
        ),
      }),
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'server',
      //   openAnalyzer: false,
      // }),
      new DuplicateReporterPlugin(),
    ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
    optimization: {
      minimize: !devMode,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
            },
          },
          parallel: true,
        }),
      ],
    },
    devtool: 'source-map',
  };
};
