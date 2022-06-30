/**
 * 判断一个数是否为素数
 * 素数：仅仅能被1和自身整除
 * 8 => 2 ~ 7
 */
export function isPrime(n:number): boolean {
    for (let i = 2; i < n; i++) {
        if(n % i === 0){
            return false;
        }
    }
    return true;
}