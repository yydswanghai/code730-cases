/**
 * 处理各个表之间建立外键联系
 */
import Class from './Class'
import Student from './Student'

Class.hasMany(Student);
Student.belongsTo(Class);

console.log('外键建立连接完成');