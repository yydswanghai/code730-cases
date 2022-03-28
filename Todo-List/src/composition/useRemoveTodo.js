// 删除任务列表
export default function useRemoveTodo(todosRef) {
    // 删除某个任务
    const remove = (todo) => {
        todosRef.value.splice(todosRef.value.findIndex(it => it.id === todo.id), 1)
    }
    // 清除已完成的任务
    const removeCompleted = () => {
        todosRef.value = todosRef.value.filter(it => !it.completed);
    }

    return {
        remove,
        removeCompleted
    }
}