/**
 * 班级
 */
import Class from '../models/Class'
export async function addClass(obj) {
    const ins = await Class.create(obj)
    return ins.toJSON()
}

export async function deleteClass(id) {
    return await Class.destroy({
        where: {
            id
        }
    })
}

export async function updateClass(id, obj) {
    return await Class.update(obj, {
        where: {
            id,
        },
    });
}
/**
 * 通过id查询班级
 */
export async function getClassById(id: string) {
    const result = await Class.findByPk(id);
    if(result){
        return result.toJSON();
    }
    return null;
}
/**
 * 查询所有班级
 */
export async function getClasses() {
    const result = await Class.findAll();
    return JSON.parse(JSON.stringify(result));
}