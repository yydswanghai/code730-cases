const TODO_LIST_KEY = 'todo-list-mvc'

/**
 * 生成一个任务的唯一编号，当前时间戳 + 4位随机数
 */
export function generateId() {
    return Date.now() + Math.random().toString(16).substr(2, 4);
}

/**
 * 获取目前所有的任务
 */
export function fetch(){
    const result = sessionStorage.getItem(TODO_LIST_KEY);
    if(result){
        return JSON.parse(result);
    }
    return [];
}

/**
 * 保存所有任务
 * @param {*} todos 任务列表
 */
export function save(todos){
    sessionStorage.setItem(TODO_LIST_KEY, JSON.stringify(todos));
}

/**
 * 过滤任务列表
 */
export function filter(todos, visibility = 'all') {
    if(visibility === 'all'){
        return todos;
    }else if(visibility === 'active'){
        return todos.filter(it => !it.completed);
    }else if(visibility === 'completed'){
        return todos.filter(it => it.completed);
    }
    throw new Error('invalid visibility value');// 无效的 visibility
}