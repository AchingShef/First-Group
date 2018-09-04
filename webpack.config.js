const path = require("path"),
    HtmlWebPackPlugin = require("html-webpack-plugin"),
    webpack = require('webpack');
 
module.exports = {
    entry: "./src/client/app.jsx",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env","@babel/preset-react"]
            }
        }, {
            test: /\.html$/,
            use: [{
                loader: "html-loader"
            }]
        }]
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [new HtmlWebPackPlugin({
            template: "./src/client/index.html",
            filename: "./index.html"
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};