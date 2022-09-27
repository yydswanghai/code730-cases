import { Sequelize } from 'sequelize'
import { sqlLogger } from '../utils/logger'

const sequelize = new Sequelize('schooldb', 'root', 'root123567', {
    host: 'localhost',
    dialect: 'mysql',
    logging: (msg) => {
        sqlLogger.debug(msg)
    }
})

// 测试连接
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('已成功建立连接.')
    } catch (error) {
        console.log('连接错误',error)
    }
}

export { sequelize, testConnection }