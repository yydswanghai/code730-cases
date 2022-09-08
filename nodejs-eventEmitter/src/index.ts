import { EventEmitter } from 'events'

// 创建一个事件处理对象
// 可以注册事件，可以触发事件
const ee = new EventEmitter();

// 可以传递参数
ee.on('abc', (arg1, arg2) => {
    console.log('abc事件触发了', arg1, arg2)
})
// 移除事件abc上的fn2
const fn2 = () => console.log('abc事件触发了第2次')
ee.on('abc', fn2)
// 运行一次
ee.once('abc', () => {
    console.log('abc事件触发了第3次，该事件仅触发一次')
})

ee.emit('abc', 123, 456);// 触发名为abc的事件，会依次运行注册的事件函数
ee.off('abc', fn2);
ee.emit('abc', 123, 456);// 再次触发名为abc的事件

console.log('script 运行');