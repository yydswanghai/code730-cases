import { configure, getLogger, shutdown } from 'log4js'
import { resolve } from 'path'

configure({
    appenders: {// 日志出口
        default: {// 默认日志
            type: 'stdout', // 控制台输出
        },
        sql: {// sql日志
            // 定义一个sql日志出口
            type: 'dateFile',// 类型：带日期的文件类型
            filename: resolve(__dirname, '../../','logs', 'sql', 'logging.log'),
            maxlogSize: 1024,// 日志记录多大(1K)后开始滚动备份
            keepFileExt: true,// 保留文件后缀
            layout: {// 自定义日志前面的
                type: 'pattern',
                pattern: '%c [%d{yyyy-MM-dd hh:mm:ss}] [%p]: %m%n',
            },
        }
    },
    categories: {// 日志分类
        default: {
            appenders: ['default'],
            level: 'all'
        },
        sql: {
            appenders: ['sql'],// 该分类使用出口sql的配置写入日志
            level: 'all'
        },
    }
})

// 程序崩溃时记录完剩下的日志
process.on('exit', () => {
    shutdown()
})

export const sqlLogger = getLogger('sql')
export const defaultLogger = getLogger()