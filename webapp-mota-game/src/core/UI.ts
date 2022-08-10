import { Map } from './Map'
import { IViewer, IMapElement } from './types'

/**
 * 显示ui的类
 */
export class UI implements IViewer {
    private _dom = document.getElementById('game') as HTMLElement
    constructor(
        private _curMap: Map// 当前玩家操作的map
    ){}
    /* 每个小方块的宽度 */
    private _itemWidth(){
        return Math.floor(window.innerWidth / this._curMap.colNumber);
    }
    /**
     * 根据地图在页面上设置相应的元素(按顺序) [row][col]
     */
    private _setContent() {
        // 1.清空容器
        this._dom.innerHTML = '';
        // 2.遍历地图内容，设置元素
        for (let row = 0; row < this._curMap.rowNumber; row++) {
            for (let col = 0; col < this._curMap.colNumber; col++) {
                this._setOnePiece(row, col);
            }
        }
    }
    /**
     * 根据行和列，创建一个div加入到容器
     * @param row 行 横的
     * @param col 列 竖的
     */
    private _setOnePiece(row: number, col: number){
        var value = this._curMap.content[row][col];
        var div: HTMLDivElement = document.createElement('div');
        div.className = 'item';
        div.style.left = col * this._itemWidth() + 'px';
        div.style.top = row * this._itemWidth() + 'px';

        // 给对应的方块添加类名
        Object.keys(IMapElement).forEach((key) => {
            const numKey = Number(key);
            if(isFinite(numKey)){
                if(value === numKey){
                    div.classList.add(IMapElement[numKey])
                }
            }
        });
        this._dom.appendChild(div);
    }
    /* 显示ui */
    showUI(): void {
        this._setContent()
    }
}