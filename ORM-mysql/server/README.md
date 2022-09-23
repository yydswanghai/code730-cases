## 服务端

node 调试

1. 直接使用`.vscode/launch.json` 配置，然后断点

2. 在浏览器使用，`ts-node` 必须安装在本地，运行`npm run debug`

* 日志目录
    * `logs`
* 服务器文件下载的目录 `src/resources`
* 服务器文件上传保存的目录
    * 原图 `src/public/origin`
    * 水印图|个性二维码 `src/public/upload`
    * 二维码原图 `src/public/qrimg`
