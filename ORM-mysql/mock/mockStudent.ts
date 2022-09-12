import Mock from 'mockjs'
import Student from '../models/Student'

const result = Mock.mock({
    "datas|500-700": [
        {
            name: "@cname",
            birthday: "@date",
            "sex|1-2": true,
            mobile: /1\d{10}/,
            //   location: "@city(true)",
            "ClassId|1-16": 0,
        }
    ]
}).datas;

/**
 * 注意添加ClassId前需要 Class与Student建立 外键联系
 */
Student.bulkCreate(result);