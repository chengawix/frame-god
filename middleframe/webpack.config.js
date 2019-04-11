const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
'use strict';

module.exports = () => ({
    mode: "production",
    entry: {
        "middleframe": './src/middleframe.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '/dist'),
        compress: true,
        port: 9000
      },
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['middleframe'],
            filename: 'middleframe.html',
            inlineSource: '.(js|css)$',
            template: `./src/middleframe.html`
        }),
        // new frameGodWebpackPlugin(),
        new HtmlWebpackInlineSourcePlugin()
    ]
});
