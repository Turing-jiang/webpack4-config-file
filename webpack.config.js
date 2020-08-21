const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename:'built.[contenthash:10].js',
        path: resolve(__dirname, './build')
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: ()=>[require('postcss-preset-env')()]
                    },
                }]

            },
            {
                test: /\.scss$/,
                use:[MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']

            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 4*1024,
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test : /\.js$/,
                exclude: /node_module/,
                loader: 'babel-loader',
                options:{
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: {version:3},
                                targets: "> 0.25%, not dead"
                            }
                        ]
                    ],
                    cacheDirectory: true
                }
            },
            {
                exclude: /\.(html|js|css|scss|jpg|png|gif)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify:{
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/built.[contenthash:10].css'
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new CleanWebpackPlugin()
    ],
    mode:'production',
    optimization:{
        splitChunks: {
            chunks: 'all'
        },
        minimizer:[
            new TerserWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    },
    devServer:{
        contentBase: './build',
        compress: true,
        port: 3005,
        hot: true,
        clientLogLevel: 'none',
        quiet: true,
    },
    devtool: 'source-map',
}
