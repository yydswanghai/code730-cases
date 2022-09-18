/**
 * 学生
 */
import Student from '../models/Student'
import Class from '../models/Class'
import { Op } from 'sequelize'
import { validators, async } from 'validate.js'
import { utc } from 'moment'
import { pick } from '../utils/propertyHelper'

export async function addStudent(obj = {}) {
    // 对传入的数据进行过滤，只保留数据库需要的
    obj = pick(obj, 'name', 'birthday', 'sex', 'mobile', 'ClassId');
    // 自定义验证，这里需要通过数据库，所以是异步验证
    validators.classExits = async function(value){
        const c = await Class.findByPk(value);
        if(c) return;
        return 'is not exist'
    }
    // 数据验证
    const rule = {
        name: {
            presence: {
                allowEmpty: false,
                message: '姓名不能为空'
            },
            type: {
                type: 'string',
                message: '姓名必须为字符串'
            },
            length: {
                minimum: 1,
                maximum: 10,
                message: '姓名长度最小为1，最大为10'
            }
        },
        birthday: {
            presence: {
                allowEmpty: false,
                message: '出生日期不能为空'
            },
            datetime: {
                dateOnly: true,// 只允许日期
                earliest: +utc().subtract(100, 'y'),// 出生日期最早不能超过100年前
                latest: +utc().subtract(5, 'y'),// 出生日期最晚不能在5年前
                message: `出生日期只允许为日期，且最早不能超过${utc(+utc().subtract(100, 'y')).format()}年前，最晚不能迟于${utc(+utc().subtract(5, 'y')).format()}年前`
            },
        },
        sex: {
            presence: true,
            type: "boolean",
        },
        mobile: {
            presence: {
                allowEmpty: false,
            },
            format: /1\d{10}/,
        },
        ClassId: {
            presence: true,
            numericality: {// 允许数字和字符串数字
                onlyInteger: true,// 实数是不允许的。错误消息为。必须是整数
                strict: false,// 不需要严格检查
            },
            classExits: true,// 使用自定义验证
        }
    }
    // 异步验证，如果通过啥都没有正常继续运行，失败直接错误
    await async(obj, rule)
    const ins = await Student.create(obj)
    return ins.toJSON()
}

export async function deleteStudent(id) {
    return await Student.destroy({
        where: {
            id
        }
    })
}

export async function updateStudent(id, obj) {
    return await Student.update(obj, {
        where: {
            id,
        },
    });
}

/**
 * 通过id查询学生
 */
export async function getStudentById(id: string) {
    const result = await Student.findByPk(id);
    if(result){
        return result.toJSON();
    }
    return null;
}
/**
 * 查询所有的学生
 */
export interface findStudents {
    page?: number
    limit?: number
    sex?: number
    name?: string
}

/**
 * 查询学生
 * 注意添加ClassId前需要 Class与Student建立 外键联系
 */
export async function getStudents({ page = 1, limit = 10, sex = -1, name = '' }: findStudents = {}) {
    const where: any = {};
    if(sex !== -1){
        where.sex = !!sex
    }
    if(name){
        where.name = {
            [Op.like]: `%${name}%`
        }
    }
    const result = await Student.findAndCountAll({
        attributes: ['id', 'name', 'sex', 'birthday', 'age'],
        where,
        include: [Class],
        offset: (page-1)*limit,
        limit
    })
    return {
        total: result.count,
        datas: JSON.parse(JSON.stringify(result.rows))
    };
}