const path = require("path"),
    HtmlWebPackPlugin = require("html-webpack-plugin");
 
module.exports = {
    entry: "./src/client/app.jsx",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env","@babel/preset-react"]
            }
        }]
    },
    plugins: [new HtmlWebPackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    })]
}