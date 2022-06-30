/**
 * 判断一个数是否为素数
 * 素数：仅仅能被1和自身整除
 * @param {Number} n
 * 8 => 2 ~ 7
 */
export default function (n) {
    for (let i = 2; i < n; i++) {
        if(n % i === 0){
            return false;
        }
    }
    return true;
}
