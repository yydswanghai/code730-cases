const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve("./dist"),
        filename: "script/bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: `${__dirname}/public/imgs/`,
                    to: `${__dirname}/dist/imgs/`
                }
            ]
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {// 避免新增类型之后重新编译报错
                        transpileOnly: true
                    }
                }
            }
        ]
    },
    resolve: {// 注意：解析模块后缀名为 .ts 和 .js的文件
        extensions: [".ts", ".js"]
    }
}