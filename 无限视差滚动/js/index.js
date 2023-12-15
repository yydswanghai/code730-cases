/**
 * 先过渡 => 改变图片
 * 注意 鼠标上， 图片下
 * 01jpg 02jpg 03jpg idx=1 idx始终是指向 02jpg这张图的
 * 03jpg 01jpg 02jpg idx=2
 * 02jpg 03jpg 01jpg idx=0
 */

const ArrayImg = [ './images/girl01.jpg', './images/girl02.jpg', './images/girl03.jpg'];
const scroll_box = document.querySelector('.scroll_box');
const cur = scroll_box.querySelector('.cur .bg');
const prev = scroll_box.querySelector('.prev .bg');
const next = scroll_box.querySelector('.next .bg');

/* 添加子元素 */
const templateContent = document.querySelector('#text').content;
prev.appendChild(document.importNode(templateContent, true));
cur.appendChild(document.importNode(templateContent, true));
next.appendChild(document.importNode(templateContent, true));

let cur_idx = +cur.dataset.idx;// 
let IsTransition = false;

// 创建图片元素
function CreatScroll_Img(index) {
  const pre_idx = index === 0 ? ArrayImg.length - 1 : index - 1;
  const next_idx = index === ArrayImg.length - 1 ? 0 : index + 1;
  console.log('pre:', pre_idx,' index:', index, ' next:', next_idx)
  cur.style.backgroundImage = `url(${ArrayImg[index]})`;
  prev.style.backgroundImage = `url(${ArrayImg[pre_idx]})`;
  next.style.backgroundImage = `url(${ArrayImg[next_idx]})`;
}

// 图片滑动
function scroll_Img(PrevOrNxet, cur) {
  const DURATION = 1;
  PrevOrNxet.style.transition = `height ${DURATION}s`;
  PrevOrNxet.style.height = '100vh';
  cur.style.transition = `transform ${DURATION}s`;
  cur.style.transform = PrevOrNxet.dataset.name === "prev" ? `translateY(20%)` : `translateY(-20%)`;
  setTimeout(function () {
    PrevOrNxet.style.transition = 'none';
    cur.style.transition = 'none';
    cur.style.transform = `translateY(0)`;
    cur.style.backgroundimage = `url(${ArrayImg[cur_idx]})`;
    PrevOrNxet.style.height = '0';
    PrevOrNxet.offsetWidth; //强制渲染
    CreatScroll_Img(cur_idx);
    IsTransition = false;
  }, DURATION * 1000);
}

// 滚动事件
window.addEventListener('wheel', function (e) {
  if (IsTransition) return;
  IsTransition = true;
  if (e.deltaY < 0) {// 上
    cur_idx--;
    if (cur_idx < 0) {
      cur_idx = ArrayImg.length - 1;
    }
    scroll_Img(scroll_box.querySelector('.prev'), cur);
  }
  if (e.deltaY > 0) {// 下
    cur_idx++;
    if(cur_idx > ArrayImg.length - 1) {
      cur_idx = cur_idx % ArrayImg.length;
    }
    scroll_Img(scroll_box.querySelector('.next'), cur);
  }
});

CreatScroll_Img(cur_idx);

