import express from 'express'
import { asyncHandler } from '../getSendResult'
import { getStudents, getStudentById, addStudent, deleteStudent, updateStudent } from '../../services/studentService'

const router = express.Router()
// 分页获取学生列表
router.get('/',
    asyncHandler(async (req, res) => {
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 10;
        const sex = Boolean(req.query.sex);
        const name = req.query.name || '';
        return await getStudents({ page, pageSize, sex, name });
    })
)
// 使用jsonp跨域: 只能get请求，且影响服务器响应格式
router.get('/jsonp',
    async (req, res) => {
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 10;
        const sex = Boolean(req.query.sex);
        const name = req.query.name || '';
        const result = await getStudents({ page, pageSize, sex, name });
        const json = JSON.stringify(result);
        const script = `callback(${json})`;
        res.header('content-type', 'application/javascript').send(script);
    }
)
// 通过id查询学生
router.get('/:id',
    asyncHandler(async (req, res) => {
        return await getStudentById(req.params.id);
    })
)
// 添加一个学生
router.post('/',
    asyncHandler(async (req, res, next) => {
        return await addStudent(req.body)
    })
)
// 删除一个学生
router.delete('/:id',
    asyncHandler(async (req, res) => {
        return await deleteStudent(req.params.id)
    })
)
// 修改一个学生
router.put('/:id',
    asyncHandler(async (req, res) => {
        return await updateStudent(req.params.id, req.body)
    })
)

export default router