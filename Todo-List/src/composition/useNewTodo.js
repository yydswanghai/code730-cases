import { ref } from 'vue';
import { generateId } from '../utils/todoStorage';
/**
 * 添加
 * @param {Array} todosRef 任务列表
 */
export default function useNewTodo(todosRef){
    const newTodoRef = ref('');// 新任务的标题
    const addTodo = () => {// 新增一个任务
        const value = newTodoRef.value && newTodoRef.value.trim();
        if(!value) return;// 空值就不添加
        // 生成一个任务对象，将其加入到任务列表中
        const todo = {
            id: generateId(),
            title: value,
            completed: false,// 任务是否完成
        };
        todosRef.value.push(todo);
        newTodoRef.value = '';
    };
    return {
        newTodoRef,
        addTodo
    }
}