/**
 * 管理员
 */
import Admin, { AdminAttributes } from '../models/Admin'
import md5 from 'md5'
import { validators, async, validate } from 'validate.js'

// 添加，需要验证 loginId, loginPwd 是否合理，以及账号是否已存在
export async function addAdmin({ loginId, loginPwd }: AdminAttributes) {
    validators.exist = async function (value) {// 自定义验证规则
        const adm = await Admin.findOne({ where: { loginId: value } });
        if(!adm) return;
        return '账号已存在，不能使用';
    }
    const rule = {
        loginId: {
            presence: {
                allowEmpty: false,
                message: '登录账号不能为空'
            },
            type: {
                type: 'string',
                message: '登录账号必须为字符串'
            },
            exist: true
        },
        loginPwd: {
            presence: {
                allowEmpty: false,
                message: '登录密码不能为空'
            },
            type: {
                type: 'string',
                message: '登录账号必须为字符串'
            },
            length: {
                minimum: 5,
                message: '密码长度不得少于5位'
            }
        }
    }
    // 异步验证，如果通过啥都没有正常继续运行，失败直接错误
    try {
        await async({ loginId, loginPwd }, rule)
        loginPwd = md5(loginPwd);
        const ins = await Admin.create({ loginId, loginPwd });
        return ins.toJSON();
    } catch (error) {
        console.log(error)
        return null;
    }
}
// 删除
export async function deleteAdmin(id: number) {
    return await Admin.destroy({
        where: { id }
    })
}

// 更新
export async function updateAdmin(id: number, { loginId, loginPwd }: AdminAttributes) {
    loginPwd = md5(loginPwd);
    return await Admin.update({ loginId, loginPwd }, {
        where: { id }
    })
}

// 登录
export async function login({ loginId, loginPwd }: AdminAttributes) {
    const val = validate({ loginId, loginPwd }, {
        loginId: {
            presence: {
                allowEmpty: false,
                message: '登录账号不能为空'
            }
        },
        loginPwd: {
            presence: {
                allowEmpty: false,
                message: '登录密码不能为空'
            }
        }
    })
    if(val){
        console.log(val)
        return null;
    }
    loginPwd = md5(loginPwd)
    const result: any = await Admin.findOne({
        where: {
            loginId,
            loginPwd
        }
    })
    // 判断用户名密码区分大小写
    if(result && result.loginId === loginId && result.loginPwd === loginPwd){
        return result.toJSON();
    }
    return null;
}

// 根据id查询管理员
export async function getAdminById(id: number) {
    const result = await Admin.findByPk(id);
    if(result){
        return result.toJSON();
    }
    return null;
}

// 查询所有的管理员
export async function getAdmins() {
    const result = await Admin.findAll();
    return JSON.parse(JSON.stringify(result));
}