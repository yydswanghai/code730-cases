import { isPrime } from './isPrime'

interface Callback {
    (n: number, b: boolean): void
}

export class NumberTimer {
    constructor(
        public duration:number = 500,
        public number:number = 1,// 当前数字
        public onNumberCreated: Callback | null = null,// 当一个数字产生的时候，要调用的回调函数
        public timerId: NodeJS.Timeout | null = null
    ){ }

    start(){
        if(this.timerId){
            return;
        }
        this.timerId = setInterval(() => {
            this.onNumberCreated && this.onNumberCreated(this.number, isPrime(this.number))
            this.number++;
        }, this.duration)
    }
    stop(){
        clearInterval(this.timerId as NodeJS.Timeout);
        this.timerId = null;
    }
}