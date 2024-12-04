import Hammer from 'hammerjs'

// 获取图片Dom元素
const el = document.getElementById('image') as HTMLElement;
const elTranslate = document.querySelector('#view .translate') as HTMLElement;
const elScale = document.querySelector('#view .scale') as HTMLElement;
const elAngle = document.querySelector('#view .angle') as HTMLElement;
// 初始化图片的 x 和 y 坐标，四舍五入在正中央
let startX = Math.round((window.innerWidth - el.offsetWidth) / 2);
let startY = Math.round((window.innerHeight - el.offsetHeight) / 2);
let changeX = startX, changeY = startY;
// 初始化一些变量
let ticking = false;// 是否正在执行动画
let transform: any = null;// 图片的transform属性
let initAngle = 0;// 初始化旋转角度
let initScale = 1;// 初始化缩放比例
let deltaAngle = 0;// 旋转角度的差值
let startRotateAngle = 0;// 开始时的旋转角度

// 初始化 hammer
const mc = new Hammer.Manager(el);// 创建一个管理器，可以同时触发旋转、缩放和移动
mc.add(new Hammer.Pan());// 添加一个移动手势
mc.add(new Hammer.Rotate()).recognizeWith(mc.get('pan'));// 添加一个旋转手势，并且和移动手势同时识别
mc.add(new Hammer.Pinch()).recognizeWith([mc.get('pan'), mc.get('rotate')]);// 添加一个缩放的手势，并且和移动手势和旋转手势同时识别

// 当移动手势开始时
mc.on('panstart panmove', function (ev) {
    if(ev.type === 'panstart'){
        startX = changeX;
        startY = changeY;
    }
    if(!ev.isFinal){
        // 进入此 if，说明拖动行为没有结束
        // 也就是用户一直都在进行拖动
        // 我们一直在更新图片的 x 和 y 值
        // deltaX：X 轴移动 deltaY：Y 轴移动
        let x = startX + ev.deltaX;
        let y = startY + ev.deltaY;
        if(x < 0){
            x = 0;
        }else if(x > window.innerWidth - el.offsetWidth){
            x = window.innerWidth - el.offsetWidth;
        }
        if(y < 0){
            y = 0;
        }else if(y > window.innerHeight - el.offsetHeight){
            y = window.innerHeight - el.offsetHeight;
        }
        changeX = x;
        changeY = y;
        transform.translate = { x, y }
        // 更新图片的transform属性
        requestUpdateElement();
    }
});

// 当手指进行缩放的时候
mc.on('pinchstart, pinchmove', function (ev) {
    if(ev.type === 'pinchstart'){
        // 进入此 if，说明缩放开始
        // 初始化缩放比例
        initScale = transform.scale || 1;
    }else{
        // 进入此 if，说明缩放进行中
        // 更新缩放比例
        transform.scale = initScale * ev.scale;
    }
    // 更新图片的transform属性
    requestUpdateElement();
});

// 当手指进行旋转的时候
mc.on('rotatestart rotatemove rotateend', function (ev) {
    // 旋转开始时
    if(ev.type === 'rotatestart'){
        startRotateAngle = ev.rotation; // 记录开始时的旋转角度
    }
    // 旋转进行中
    if(ev.type === 'rotatemove'){
        // 计算旋转角度的差值
        deltaAngle = ev.rotation - startRotateAngle;
        transform.rz = 1;
        transform.angle = initAngle + deltaAngle;
        // 更新图片的transform属性
        requestUpdateElement();
    }
    // 旋转结束时
    if(ev.type === 'rotateend'){
        // 旋转结束的时候，我们只需要更新一下初始的旋转角度即可
        initAngle = transform.angle;
    }
})

function updateElementTransform() {
    el.style.transform = `
        translate(${transform.translate.x}px, ${transform.translate.y}px)
        scale(${transform.scale})
        rotate(${transform.angle}deg)
    `;
    elTranslate.innerHTML = `坐标：x: ${transform.translate.x} y: ${transform.translate.y}`
    elScale.innerHTML = `缩放：${transform.scale}`
    elAngle.innerHTML = `角度：${transform.angle}`
    ticking = false;
}

// 当手指进行缩放的时候
function requestUpdateElement() {
    if(!ticking){
        // 进入此 if，说明没有在执行动画
        window.requestAnimationFrame(updateElementTransform);
        ticking = true;
    }
}

// 初始化图片的transform属性
(function () {
    transform = {
        translate: {
            x: startX,
            y: startY
        },
        scale: initScale,
        rx: 0,
        ry: 0,
        rz: 1,
        angle: initAngle
    };
    // 更新图片的transform属性
    requestUpdateElement();
})();