const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const colors = require('colors')

module.exports = (env) => {
  return ({
    mode: 'production',
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "script/bundle.js",
    },
    module: {
      rules: [
            {
                test: /.ts$/,
                loader: "ts-loader"
            },
        ]
    },
    resolve: {// 注意：解析模块后缀名为 .ts 和 .js的文件
        extensions: [".ts", ".js"]
    },
    stats: env.prod ? 'normal' : 'minimal',// 控制输出的详细程度
    devServer: {
      port: 9527,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      !env.prod && new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`您的应用程序正在此处运行 ${colors.blue.underline('http://localhost:9527')}`],
        }
      }),
      new CleanWebpackPlugin(),
      new CopyPlugin({
          patterns: [
              {
                  from: `${__dirname}/public/imgs/`,
                  to: `${__dirname}/dist/imgs/`
              }
          ]
      }),
    ]
  })
}