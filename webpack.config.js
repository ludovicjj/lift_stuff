const path = require('path')
module.exports = {
    mode: "development",
    entry: "./public/js/rep_log.js",
    output: {
        path: path.resolve(__dirname, "public", "build"),
        filename: "rep_log.js"
    }
}