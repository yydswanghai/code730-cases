var box = document.getElementById('box');
var container = document.getElementById('list-container');
var items = document.getElementsByClassName('item');

/**
 * 创建一个滚动条从 scrollStart ~ scrollEnd 对应
 * 取值范围在 valueStart ~ valueEnd 的动画函数
 * @param scroll 当前滚动的位置
 * 比如 100~500 之间 变化opacity 0~1 则滚动在200时：0+(1-0)*(200-100)/(500-100)
*/
function createAnimation(scrollStart, scrollEnd, valueStart, valueEnd) {
    return function (scroll) {
        if(scroll <= scrollStart){
            return valueStart;
        }
        if(scroll >= scrollEnd){
            return valueEnd;
        }
        return valueStart + (valueEnd - valueStart) * (scroll - scrollStart) / (scrollEnd - scrollStart);
    }
}

/**
 * key => dom
 * value => {
 *      opacity: (scroll) => '属性值',
 *      transform: (scroll) => '属性值'
 * }
*/
const animationMap = new Map();
// 生成该动画map数据结构
function createMap() {
    animationMap.clear();
    const boxRect = box.getBoundingClientRect();
    // 从container的底部开始
    const startScroll = boxRect.top + window.scrollY - container.clientHeight;
    const endScroll = boxRect.bottom + window.scrollY - window.innerHeight;
    for(let item of items){
        animationMap.set(item, getDomAnimation(item, startScroll, endScroll))
    }
}
createMap()
function getDomAnimation(dom, startScroll, endScroll) {
    startScroll = startScroll + dom.dataset.order*240;
    const opacityAnimation = createAnimation(startScroll, endScroll, 0, 1);
    const opacity = (scroll) => opacityAnimation(scroll);
    const scaleAnimation = createAnimation(startScroll, endScroll, 0.5, 1);
    const xAnimation = createAnimation(startScroll, endScroll,
        container.clientWidth/2 - dom.offsetLeft - dom.clientWidth/2 ,0)
    const yAnimation = createAnimation(startScroll, endScroll,
        container.clientHeight/2 - dom.offsetTop - dom.clientHeight/2 ,0)
    const transform = (scroll) => {
        return `translate(${xAnimation(scroll)}px, ${yAnimation(scroll)}px) scale(${scaleAnimation(scroll)}) `
    }
    return {
        opacity,
        transform
    }
}

function updateStyles() {
    const scroll = window.scrollY;
    for (const [dom, value] of animationMap) {
        for (const cssProp in value) {
            dom.style[cssProp] = value[cssProp](scroll);
        }
    }
}

updateStyles()

window.addEventListener('scroll', updateStyles);