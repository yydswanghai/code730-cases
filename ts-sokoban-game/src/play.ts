import { correct, content, rowNumber, colNumber, ICorrect, MapElement } from "./map"

interface INextInfo extends ICorrect {
    value: number
}

/**
 * 判断游戏是否胜利
 */
export function isWin(){
    // 是否每个正确的位置都有箱子
    for (let i = 0; i < correct.length; i++) {
        var point = correct[i];
        if(content[point.row][point.col] !== MapElement.BOX){
            return false;// 该位置上没有箱子
        }
    }
    return true;
}

/**
 * 按照指定的方向，让玩家移动一步
 * @param direction left、right、up、down
 */
export function playerMove(direction: string){
    var playerPoint = getPlayerPoint();
    // 得到玩家下一个位置的信息
    var nextInfo = getNextInfo(playerPoint.row, playerPoint.col, direction);

    // 不能移动的情况，下一个信息是墙
    if(nextInfo.value === MapElement.WALL){
        return false;
    }

    if(nextInfo.value === MapElement.SPACE){
        // 下一个是空白
        exchange(playerPoint, nextInfo);
        return true;
    }else{
        // 下一个是箱子
        // 获取箱子的下一个位置信息
        var nextNextInfo = getNextInfo(nextInfo.row, nextInfo.col, direction);
        if(nextNextInfo.value === MapElement.SPACE){
            // 可以移动
            exchange(nextInfo, nextNextInfo);
            exchange(playerPoint, nextInfo);
            return true;
        }else{
            // 不可以移动
            return false;
        }
    }
}

/**
 * 得到玩家位置
 */
function getPlayerPoint(): ICorrect{
    for (let row = 0; row < rowNumber; row++) {
        for (let col = 0; col < colNumber; col++) {
            const value = content[row][col];
            if(value === MapElement.PLAYER){
                return { row, col }
            }
        }
    }
    throw new Error('地图上居然没有玩家');
}

/**
 * 得到某个位置在指定方向上的下一个位置的信息（第几行、第几列、内容是啥）
 * @param row 指定的行
 * @param col 指定的列
 * @param direction
 */
function getNextInfo(row: number, col: number, direction: string): INextInfo{
    if(direction === 'left'){
        return {
            row: row,
            col: col - 1,
            value: content[row][col - 1]
        }
    }
    else if(direction === 'right'){
        return {
            row: row,
            col: col + 1,
            value: content[row][col + 1]
        }
    }
    else if(direction === 'up'){
        return {
            row: row - 1,
            col: col,
            value: content[row - 1][col]
        }
    }else{
        return {
            row: row + 1,
            col: col,
            value: content[row + 1][col]
        }
    }
}

/**
 * 交换位置
 */
function exchange(player1: INextInfo | ICorrect, player2: INextInfo | ICorrect){
    var temp = content[player1.row][player1.col];
    content[player1.row][player1.col] = content[player2.row][player2.col];
    content[player2.row][player2.col] = temp;
}