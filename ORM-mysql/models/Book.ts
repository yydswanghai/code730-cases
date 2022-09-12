import { sequelize } from './db'
import { DataTypes } from 'sequelize'

export default sequelize.define('Book', {
    name: {
        type: DataTypes.STRING,
        allowNull: false// 不允许为null
    },
    imgurl: {
        type: DataTypes.STRING,
    },
    publishDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    paranoid: true,// 从此以后该表的数据不会真正的删除，而是增加一列deleteAt，记录删除时间
});