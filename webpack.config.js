const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        rep_log: "./assets/js/rep_log.js",
        main: "./assets/js/main.js",
        login: "./assets/js/login.js"
    },
    output: {
        path: path.resolve(__dirname, "public", "build"),
        filename: "[name].js",
        assetModuleFilename: 'asset/[hash][ext][query]',
        publicPath: '/build/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name]-[hash:6][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash:6][ext][query]'
                }
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: "assets/static", to: "static"}
            ]
        })
    ],
    devtool: 'inline-source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    devServer: {
        https: {
            key: fs.readFileSync("./ssl/cert.key"),
            cert: fs.readFileSync("./ssl/cert.crt"),
            ca: fs.readFileSync("./ssl/ca.crt"),
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        port: 8080,
        hot: true
    }
}