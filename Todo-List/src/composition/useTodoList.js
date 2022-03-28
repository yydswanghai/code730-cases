import { ref, watchEffect } from 'vue';
import * as todoStorage from '../utils/todoStorage.js';
// 任务列表数据
export default function useTodoList() {
    const todosRef = ref(todoStorage.fetch());
    window.todosRef = todosRef;// 测试

    watchEffect(() => {// Detail: https://segmentfault.com/a/1190000023669309 
        todoStorage.save(todosRef.value);
    });

    return {
        todosRef,
    }
}