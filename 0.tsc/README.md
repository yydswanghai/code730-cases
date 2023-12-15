## 说明

1. "dev": "nodemon --watch src -e ts --exec ts-node src/index.ts"

这个命令的作用是监视 src 目录下的 TypeScript 文件的变化，当文件变化时，使用 ts-node 运行 src/index.ts 文件。这样可以实现在开发过程中实时监测文件变化并自动重启应用。

* nodemon: 启动 nodemon 工具。
* --watch src: 监视 src 目录下文件的变化。
* -e ts: 指定监视的文件扩展名为 .ts。
* --exec ts-node src/index.ts: 当文件变化时，执行的命令。在这里是使用 ts-node 执行 src/index.ts 文件，其中 ts-node 会直接运行 TypeScript 代码而不需要先将其编译成 JavaScript

2. "build": "rd /s /q dist & tsc"

这个脚本的作用是先清空 dist 目录，然后运行 TypeScript 编译，将 TypeScript 代码编译为 JavaScript，并将输出文件放置在 dist 目录中。

* `rd /s /q dist`: 这个命令会递归地删除 dist 目录及其下的所有内容。/s 表示递归删除子目录，/q 表示以静默模式（不提示确认）执行。
* `tsc`: 这个命令是 TypeScript 编译器的命令。运行 tsc 会根据项目中的 tsconfig.json 文件配置，将 TypeScript 代码编译成 JavaScript 代码。