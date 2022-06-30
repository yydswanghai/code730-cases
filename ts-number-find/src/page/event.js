import NumberTimer from '../util/number'
import appendNumber from './appendNumber'

/* 该模块用于注册事件 */
var n = new NumberTimer(500)
n.onNumberCreated = function(num, isPrime){
    appendNumber(num, isPrime)
}

var isStart = false;
window.onclick = function () {
    if(isStart){
        n.stop();
        isStart = false;
    }else{
        n.start();
        isStart = true;
    }
}