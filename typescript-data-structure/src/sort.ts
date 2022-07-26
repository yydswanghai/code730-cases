const arr = [4, 1, 6, 9, 3, 2, 8, 7];

/* 比较之后需要得出是否需要交换 */
function compare(a, b) {
    if(a < b){
        return true;
    }else{
        return false;
    }
}
/* 将数组中ab位置里的值进行交话 */
function swap(array, a, b) {
    [array[a], array[b]] = [array[b], array[a]];
}
function quick(arr, left, right) {
    let index;
    if(arr.length > 1){
        index = partition(arr, left, right);
        if(left < index -1){
            quick(arr, left, index-1);
        }
        if(index < right){
            quick(arr, index, right);
        }
    }
    return arr;
}
function partition(arr, left, right) {
    const pivot = arr[Math.floor((right + left) / 2)];// 主元:选择中间值 3
    while (left <= right) {
        while (compare(arr[left], pivot)) {// 移动left指针直到找到一个比主元大的元素
            left++;
        }
        while (compare(pivot, arr[right])) {// 移动right指针直到我们找到一个比主元小的元素
            right--;
        }
        if(left <= right){// 左项比右项大
            swap(arr, left, right);
            left++;
            right--;
        }
    }
    return left;
}
function quickSort(arr) {
    return quick(arr, 0, arr.length - 1);
}

console.log(quickSort(arr));
// 4 1 6 9 3 2 8 7