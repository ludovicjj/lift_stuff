const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const useVersioning = true;

const isDevelopment = process.env.NODE_ENV !== 'production';
const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: !isDevelopment
    }
};
const webpackConfig = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        rep_log: "./assets/js/rep_log.js",
        main: "./assets/js/main.js",
        login: "./assets/js/login.js"
    },
    output: {
        path: path.resolve(__dirname, "public", "build"),
        filename: useVersioning ? "[name].[hash:6].js" : "[name].js",
        assetModuleFilename: 'asset/[hash][ext][query]',
        publicPath: '/build/',
        clean: true
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
                    cssLoader
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    cssLoader,
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
            filename: useVersioning ? "[name].[contenthash:6].css" : "[name].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: "assets/static", to: "static"}
            ]
        }),
        new WebpackManifestPlugin({
            writeToFileEmit: true,
            basePath: 'build/'
        })
    ],
    devtool: isDevelopment ? 'inline-source-map' : false,
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

if (!isDevelopment) {
    webpackConfig.optimization.minimize = true;
    webpackConfig.optimization.minimizer = [
        new TerserPlugin(),
        new CssMinimizerPlugin()
    ];
}

module.exports = webpackConfig;