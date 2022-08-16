const path = require('path')
module.exports = {
    mode: "development",
    entry: {
        rep_log: "./public/js/rep_log.js",
        menu: "./public/js/menu.js",
        tooltip: "./public/js/tooltip.js"
    },
    output: {
        path: path.resolve(__dirname, "public", "build"),
        filename: "[name].js"
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
            }
        ]
    }
}