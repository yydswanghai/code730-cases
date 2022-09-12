import Mock from 'mockjs'
import Class from '../models/Class'

const result = Mock.mock({
    "datas|16": [
        {
            "id|+1": 1,
            name: "前端第 @id 期",
            openDate: "@date"
        }
    ]
}).datas;

Class.bulkCreate(result);