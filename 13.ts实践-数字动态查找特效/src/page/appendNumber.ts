import $ from 'jquery'
import { radColor, getRandom } from '../util/radColor';

// 用于添加 <span>1</span>
let divContainer: JQuery<HTMLElement> = $('#divContainer')
// 用于中间显示 <span>1</span>
let divCenter: JQuery<HTMLElement> = $('#divCenter')

export function appendNumber(n: number, isPrime: boolean) {
    let span = $('<span>').text(n);
    if(isPrime){// 是素数
        let color = radColor();
        span.css('color', color);
        createCenterPrimeNumber(n, color);// 设置为素数的中间的数
    }
    divContainer.append(span);
    divCenter.text(n);// 设置非素数的中间的数
}

/**
 * 在中间产生一个素数
 */
function createCenterPrimeNumber(n: number, color: string) {
    let div = $('<div>').addClass('center').css('color', color).text(n);
    $('body').append(div);
    // 加入了div后，强行让页面重新渲染
    getComputedStyle(div[0]).left;
    div.css("transform", `translate(${getRandom(-200, 200)}px, ${getRandom(-200, 200)}px)`).css("opacity", 0)
}