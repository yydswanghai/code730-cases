/**
 * 管理员
 */
import Admin, { AdminAttributes } from '../models/Admin'
import md5 from 'md5'

export async function addAdmin({ loginId, loginPwd }: AdminAttributes) {
    loginPwd = md5(loginPwd)
    const ins = await Admin.create({ loginId, loginPwd })
    console.log('添加管理员成功')
    return ins.toJSON()
}

export async function deleteAdmin(adminId) {
    return await Admin.destroy({
        where: {
            id: adminId
        }
    })
}

export async function updateAdmin(id, { loginId, loginPwd }: AdminAttributes) {
    loginPwd = md5(loginPwd)
    return await Admin.update({ loginId, loginPwd }, {
        where: {
            id,
        },
    });
}

/**
 * 登录
 */
export async function login({ loginId, loginPwd }: AdminAttributes) {
    loginPwd = md5(loginPwd)
    const result: any = await Admin.findOne({
        where: {
            loginId,
            loginPwd
        }
    })
    // 判断用户名密码区分大小写
    if(result && result.loginId === loginId && result.loginPwd === loginPwd){
        console.log('登录成功')
        return result.toJSON();
    }
    return null;
}
/**
 * 根据id查询管理员
 */
export async function getAdminById(id: string) {
    const result = await Admin.findByPk(id);
    if(result){
        return result.toJSON();
    }
    return null;
}
/**
 * 查询所有的管理员
 */
export async function getAdmins() {
    const result = await Admin.findAll();
    return JSON.parse(JSON.stringify(result));
}