
import { ref, computed } from "vue";

// 编辑任务列表
export default function useEditTodo(todosRef) {
    const editingTodoRef = ref(null);// 当前正在修改的是哪一个todo
    let originTitle = ref('');// 缓存之前的title值


    const editTodo = (todo) => {
        originTitle = todo.title;
        editingTodoRef.value = todo;
    }
    // 完成编辑
    const doneEdit = (todo) => {
        editingTodoRef.value = null;
        const title = todo.title.trim();
        if(title){
            todo.title = title;
        }else{
            // 如果编辑将title清空了，则删除该任务
            const index = todosRef.value.findIndex(it => it.id === todo.id);
            if(index >= 0){
                todosRef.value.splice(index, 1);
            }
        }
    }
    // 取消编辑
    const cancelEdit = (todo) => {
        editingTodoRef.value = null;
        todo.title = originTitle;
    }

    // 全部完成 => 没完成的长度为0
    const allDoneRef = computed({
        get(){
            return todosRef.value.filter(it => !it.completed).length === 0
        },
        set(checked){
            // checked = true 时，选中input，既选中，全部完成就是全部都同时选中
            todosRef.value.forEach((todo) => {
                todo.completed = checked;
            });
        }
    })
    
    return {
        editingTodoRef,
        editTodo,
        doneEdit,
        cancelEdit,
        allDoneRef
    }
}