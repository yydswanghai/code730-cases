import { sequelize } from './db'
import { DataTypes, Model, Optional, DestroyOptions } from 'sequelize'

export interface AdminAttributes {
    loginId: string
    loginPwd: string
}
export interface AdminAttributesId extends AdminAttributes, DestroyOptions {
    id: string
}
// 调用 model.create() 或 model.build()时 某些字段是可选的
interface AdminCreationAttributes extends Optional<AdminAttributes, 'loginId'> {}

// 我们需要为我们的模型声明一个接口，这基本上就是我们的类
interface AdminInstance extends Model<AdminAttributes, AdminCreationAttributes>, AdminAttributes {}

export default sequelize.define('Admin', {
    loginId: {
        type: DataTypes.STRING,
        allowNull: false// 不允许为null
    },
    loginPwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    createdAt: false,
    updatedAt: false,
    paranoid: true,// 从此以后该表的数据不会真正的删除，而是增加一列deleteAt，记录删除时间
});