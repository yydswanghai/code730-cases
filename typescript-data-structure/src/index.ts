// 青蛙跳台阶
function jump(n) {
    if(n <= 0) return -1;
    if(n === 1) return 1;
    if(n === 2) return 2;
    let result = 0;
    for (let i = 1; i < n; i++) {// i=1从1阶开始，避免无限递归
        result += jump(n - i)
    }
    return result + 1;// +1代表从0级台阶直接跳上去的情况
}

console.log(jump(4))