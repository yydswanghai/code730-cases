/**
 * 书
 */
import Book from '../models/Book'
import { Op } from 'sequelize'

export async function addBook(obj) {
    const ins = await Book.create(obj)
    return ins.toJSON()
}

export async function deleteBook(id) {
    return await Book.destroy({
        where: {
            id
        }
    })
}

export async function updateBook(id, obj) {
    return await Book.update(obj, {
        where: {
            id,
        },
    });
}

/**
 * 通过id查询书
 */
export async function getBookById(id: string) {
    const result = await Book.findByPk(id);
    if(result){
        return result.toJSON();
    }
    return null;
}
export interface findBooks {
    page?: number
    limit?: number
    keywords?: string
}
export async function getBooks({ page = 1, limit = 10, keywords = '' }: findBooks = {}) {
    const result = await Book.findAndCountAll({
        where: {
            [Op.or]: [
                //里面的两个条件是或者关系
                {
                    //条件1：姓名模糊匹配关键词
                    name: {
                        [Op.like]: `%${keywords}%`
                    }
                },
                {
                    //条件2：作者模糊匹配关键词
                    author: {
                        [Op.like]: `%${keywords}%`,
                    },
                }
            ]
        },
        offset: (page - 1) * limit,
        limit
    });
    return {
        total: result.count,
        datas: JSON.parse(JSON.stringify(result.rows))
    }
}
