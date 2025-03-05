const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = (env) => ({
    entry: './src/index.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        filename: 'main.[contenthash].js',
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                // use: [
                //   {
                //     loader: 'file-loader',
                //     options: {
                //       name: '[name].[ext]',
                //       outputPath: '/',
                //       useRelativePath: true
                //     }
                //   },
                // ]
            },
            {
                test: /\.scss$/i,
                use: [
                  env.prod ? MiniCssExtractPlugin.loader :
                  'style-loader',
                  'css-loader',
                  'sass-loader'],
            },
            {
                test: /\.(?:js)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env']
                    ]
                  }
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },

        ]
    },
    optimization: {
      minimizer: [
        "...",
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              // Lossless optimization with custom option
              // Feel free to experiment with options for better result for you
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
                // Svgo configuration here https://github.com/svg/svgo#configuration
                [
                  "svgo",
                  {
                    plugins: [
                      {
                        name: "preset-default",
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [
                                  { xmlns: "http://www.w3.org/2000/svg" },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
      ],
    },
    plugins: [
        new HtmlWebpackPlugin({}),
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css',
        }),
        new FileManagerPlugin({
            events: {
                onStart: {
                delete: ['dist'],
                },
            },
        }),
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
    }
})
