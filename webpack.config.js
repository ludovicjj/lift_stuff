const path = require('path')
module.exports = {
    mode: "development",
    entry: {
        rep_log: "./public/js/rep_log.js",
        menu: "./public/js/menu.js",
        main: "./public/js/main.js",
        login: "./public/js/login.js"
    },
    output: {
        path: path.resolve(__dirname, "public", "build"),
        filename: "[name].js",
        assetModuleFilename: 'images/[hash][ext][query]'
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
                        cacheDirectory: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    }
}