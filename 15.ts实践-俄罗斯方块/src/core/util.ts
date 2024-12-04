/**
 * 根据最小值和最大值得到范围内的随机数（无法取到最大值）
 */
export function getRandom(min:number, max:number) {
    const dec = max - min;
    return Math.floor(Math.random() * dec + min)
}