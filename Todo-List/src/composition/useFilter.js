import { ref, onMounted, onUnmounted, computed } from 'vue';
import { filter } from '../utils/todoStorage';
// 过滤任务列表
const validHash = ['all', 'active', 'completed'];

export default function useFilter(todosRef) {
    const visibilityRef = ref('all');
    const onHashChange = () => {
        const hash = window.location.hash.replace(/#\/?/,'');
        if(validHash.includes(hash)){
            // 有效的
            visibilityRef.value = hash;
        }else{
            window.location.hash = '';
            visibilityRef.value = 'all';
        }
        console.log(visibilityRef.value);
    }
    // 1. 组件挂载完成的生命周期函数
    onMounted(() => {
        window.addEventListener('hashchange', onHashChange)
    })
    // 2. 组件销毁过后的生命周期函数
    onUnmounted(() => {
        window.removeEventListener('hashchange', onHashChange)
    })

    const filterTodosRef = computed(() => {
        return filter(todosRef.value, visibilityRef.value);
    })
    // 剩余
    const remainingRef = computed(() => {
        return filter(todosRef.value, 'active').length;
    })
    // 完成
    const completedRef = computed(() => {
        return filter(todosRef.value, 'completed').length;
    })

    return {
        visibilityRef,
        filterTodosRef,
        remainingRef,
        completedRef
    }
}