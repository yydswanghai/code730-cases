import { Map } from './Map'
import { Player } from './Player'
import { ICorrectInfo, IMapElement, IDirection } from './types'

export class Play {
    constructor(
        private _curMap: Map,// 当前玩家操作的map
        private _curPlayer: Player// 当前玩家操作的主角
    ){}
    /**
     * 得到玩家位置
     */
    private _getPlayerPoint(): ICorrectInfo{
        for (let row = 0; row < this._curMap.rowNumber; row++) {
            for (let col = 0; col < this._curMap.colNumber; col++) {
                const value = this._curMap.content[row][col];
                if(value === IMapElement.player){
                    return { row, col, value };
                }
            }
        }
        throw new Error("地图上没有找到玩家");
    }
    /**
     * 得到某个位置在指定方向上的下一个位置的信息（第几行、第几列、内容是啥）
     * @param row 指定的行
     * @param col 指定的列
     * @param direction left、right、up、down
     */
    private _getNextInfo(row: number, col: number, direction: IDirection): ICorrectInfo{
        // 超出地图边界 不移动
        if(direction === 'left'){
            let newCol = col - 1;
            if(newCol < 0){
                newCol = 0;
            }
            return {
                row,
                col: newCol,
                value: this._curMap.content[row][newCol]
            }
        }else if(direction === 'right'){
            let newCol = col + 1;
            if(newCol > this._curMap.colNumber - 1){
                newCol = this._curMap.colNumber - 1;
            }
            return {
                row,
                col: newCol,
                value: this._curMap.content[row][newCol]
            }
        }else if(direction === 'up'){
            let newRow = row - 1;
            if(newRow < 0){
                newRow = 0;
            }
            return {
                row: newRow,
                col,
                value: this._curMap.content[newRow][col]
            }
        }else{// 'down'
            let newRow = row + 1;
            if(newRow > this._curMap.rowNumber - 1){
                newRow = this._curMap.rowNumber - 1;
            }
            return {
                row: newRow,
                col,
                value: this._curMap.content[newRow][col]
            }
        }
    }
    /**
     * 交换位置
     * @param player1 当前位置
     * @param player2 下一步位置
     */
    private _exchange(player1: ICorrectInfo, player2: ICorrectInfo){
        const { content } = this._curMap;
        const temp = content[player1.row][player1.col];
        content[player1.row][player1.col] = content[player2.row][player2.col];
        content[player2.row][player2.col] = temp;
    }
    /**
     * 交换位置，玩家被替换至player2位置，player1替换为空白
     * @param player1 当前位置
     * @param player2 下一步位置
     */
    private _exchangeHero(player1: ICorrectInfo, player2: ICorrectInfo){
        const { key } = this._curPlayer;
        const { content } = this._curMap;
        if(key > 0){
            content[player2.row][player2.col] = content[player1.row][player1.col];
            content[player1.row][player1.col] = IMapElement.space;
        }else{
            console.log('没有钥匙，不能开门')
        }
    }
    /**
     * 按照指定的方向，让玩家移动一步
     * @param direction left、right、up、down
     */
    playerMove(direction: IDirection){
        var playerPoint = this._getPlayerPoint();// 玩家位置
        var nextInfo = this._getNextInfo(playerPoint.row, playerPoint.col, direction);// 玩家下一个位置的信息
        // 超出地图边界
        if(playerPoint.row === nextInfo.row && playerPoint.col === nextInfo.col){
            console.log('移动失败，还在原地')
            return false;
        }
        // 下一个位置是墙，不能移动
        if(nextInfo.value === IMapElement.wall){
            return false;
        }
        // 下一个位置是门
        if(nextInfo.value === IMapElement.door){
            this._exchangeHero(playerPoint, nextInfo);
            return true;
        }
        // 下一个位置是空白
        if(nextInfo.value === IMapElement.space){
            this._exchange(playerPoint, nextInfo);
            return true;
        }
    }
}