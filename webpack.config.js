const path = require("path"),
    HtmlWebPackPlugin = require("html-webpack-plugin"),
    // webpack = require('webpack'),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    outputDirectory = "dist";
 
module.exports = {
    entry: "./src/client/app.jsx",
    output: {
        path: path.resolve(__dirname, outputDirectory),
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
        }, 
        {
            test: /\.html$/,
            use: [{
                loader: "html-loader"
            }]
        }
    ]
    },
    devServer: {
        port: 3000,
        open: true,
        proxy: {
          '/api': 'http://localhost:8080'
        }
      },
    plugins: [new HtmlWebPackPlugin({
            template: "./src/client/index.html",
            filename: "./index.html"
        }),
        new CleanWebpackPlugin([outputDirectory])
    ]
};