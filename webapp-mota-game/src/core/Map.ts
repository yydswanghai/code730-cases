import { ICorrect } from './types'

/**
 * 地图类
 */
export class Map {
    constructor(
        public content: number[][],
        public correct: ICorrect[]// 正确(通关)位置
    ){}
    /* 总列数(横的) */
    get colNumber(){
        return this.content[0].length;
    }
    /* 总行数(竖的) */
    get rowNumber(){
        return this.content.length;
    }
}