// reflect-metadata的使用
// reflect-metadata主要用来帮我们保存元数据

import "reflect-metadata"

@Reflect.metadata('a1', 'da24d12a1d')
@Reflect.metadata('a', '一个类')// 需要一个key
class A {
    @Reflect.metadata('prop', '一个属性')
    prop1: string
}

const obj = new A();

console.log(Reflect.getMetadata("a", A))
console.log(Reflect.getMetadata("prop", obj, "prop1"))