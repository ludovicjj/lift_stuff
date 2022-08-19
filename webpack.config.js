const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const styleLoader = {
    loader: "style-loader",
    options: {}
}
const cssLoader = {
    loader: "css-loader",
    options: {}
}
const sassLoader = {
    loader: "sass-loader",
    options: {}
}

module.exports = {
    mode: "development",
    entry: {
        rep_log: "./assets/js/rep_log.js",
        menu: "./assets/js/menu.js",
        main: "./assets/js/main.js",
        login: "./assets/js/login.js"
    },
    output: {
        path: path.resolve(__dirname, "public", "build"),
        filename: "[name].js",
        assetModuleFilename: 'asset/[hash][ext][query]'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    styleLoader,
                    cssLoader
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    styleLoader,
                    cssLoader,
                    sassLoader
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
        new CopyWebpackPlugin({
            patterns: [
                {from: "assets/static", to: "static"}
            ]
        })
    ]
}