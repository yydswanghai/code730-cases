import { correct, content, rowNumber, colNumber, MapElement } from "./map"

var divContainer = document.getElementById('game') as HTMLElement;
var pieceWidth = 45;
var pieceHeight = 45;
/**
 * 设置div的宽度
 */
function setDivContainer(){
    divContainer.style.width = pieceWidth * colNumber + 'px';
    divContainer.style.height = pieceHeight * rowNumber + 'px';
}

/**
 * 根据地图在页面上设置相应的元素(按顺序) [row][col]
 */
function setContent(){
    // 1.清空容器
    divContainer.innerHTML = '';
    // 2.遍历地图内容，设置元素
    for (let row = 0; row < rowNumber; row++) {
        for (let col = 0; col < colNumber; col++) {
            setOnePiece(row, col);// => 00 01 02 ... 10 11 12...20 21 22...
        }
    }
}

/**
 * 根据行和列，创建一个div加入到容器
 */
function setOnePiece(row: number, col: number){
    var value = content[row][col];// 取出地图相应位置的值
    var div: HTMLDivElement = document.createElement('div');
    div.className = 'item';
    div.style.left = col * pieceWidth + 'px';
    div.style.top = row * pieceHeight + 'px';

    var correct = isCorrect(row, col);
    if(value === MapElement.PLAYER){
        div.classList.add('player');
    }else if(value === MapElement.WALL){
        div.classList.add('wall');
    }else if(value === MapElement.BOX){
        if(correct){
            // 正确的位置
            div.classList.add('correct-box');
        }else{
            div.classList.add('box');
        }
    }else{
        // 空白
        if(correct){
            // 正确的位置
            div.classList.add('correct');
        }else{
            return;
        }
    }

    divContainer.appendChild(div);
}

/**
 * 判断该行该列是否是正确位置
 * @param {*} row
 * @param {*} col
 */
function isCorrect(row: number, col: number){
    // row col 这个坐标点上能否找到与 correct 数组里对应的值
    return correct.find(item => item.row === row && item.col === col) !== undefined
}

/**
 * 该函数用于显示地图
 */
export function showUi(){
    // 1.设置div的宽高
    setDivContainer();
    // 2.显示地图中的内容
    setContent();
}