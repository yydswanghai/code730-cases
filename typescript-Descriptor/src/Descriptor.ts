// 类装饰器工厂
export function classDescriptor(description: string) {
    return function (target: Function) {
        // 保存到该类的原型中
        target.prototype.$classDescription = description
    }
}
// 属性装饰器工厂
export function porpDescriptor(description: string) {
    return function (target: any, propName: string) {
        // 把所有的属性信息保存到该类的原型中  target为原型，这里都作用在实例属性上
        if(!target.$propDescription){
            target.$propDescription = [];
        }
        target.$propDescription.push({
            propName,
            description
        });
    }
}

export function printObj(obj: any) {
    // 输出类的名字
    if(obj.$classDescription){
        console.log(obj.$classDescription)
    }else{
        console.log(obj.__proto__.constructor.name)
    }
    if(!obj.$propDescription){
        obj.$propDescription = []
    }
    // 输出所有的属性描述和属性值
    for (const key in obj) {
        if(obj.hasOwnProperty(key)){// 排除原型上的
            const prop = obj.$propDescription.find((p: any) => p.propName === key)
            if(prop){
                console.log(`\t${prop.description}:${obj[key]}`)
            }else{
                console.log(`\t${key}:${obj[key]}`)
            }
        }
    }
}