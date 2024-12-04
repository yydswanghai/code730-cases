import GameConfig from "./GameConfig"
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup"
import { IPoint, IShape, IMoveDirection } from "./types"

/**
 * 类型保护函数：是不是IPoint类型
 */
function isPoint(obj: any): obj is IPoint {
    if(typeof obj.x === 'undefined'){
        return false;
    }
    return true;
}

/**
 * 该类中提供一系列的函数，根据游戏规则判断各种情况
 */
export class TetrisRule {
    /**
     * 判断某个形状的方块，是否能够移动到目标位置
     */
    static canIMove(shape: IShape, targetPoint: IPoint, exists: Square[]): boolean{
        // 当前形状在目标位置，先要将形状变换到目标位置
        const targetSquarePoints: IPoint[] = shape.map(it => {
            return {
                x: it.x + targetPoint.x,
                y: it.y + targetPoint.y
            }
        })
        // 边界判断
        let result = targetSquarePoints.some(p => {
            return p.x < 0 ||
            p.x > GameConfig.panelSize.width-1 ||
            p.y < 0 ||
            p.y > GameConfig.panelSize.height-1;
        })
        if(result){// 如果超出边界则说明不能移动返回false
            return false;
        }
        // 判断是否与已有的方块有重叠
        result = targetSquarePoints.some(p => {
            return exists.some(sq => sq.point.x === p.x && sq.point.y === p.y)
        })
        if(result){// 如果触底了说明不能移动返回false
            return false;
        }
        // 可以移动
        return true;
    }

    /**
     * 移动
     * @param tetris
     * @param targetPoint 根据目标点
     * @param direction 根据方向移动
     */
    static move(tetris: SquareGroup, targetPoint: IPoint, exists: Square[]): boolean
    static move(tetris: SquareGroup, direction: IMoveDirection, exists: Square[]): boolean
    static move(tetris: SquareGroup, targetPointOrDirection: IPoint | IMoveDirection, exists: Square[]): boolean{
        if(isPoint(targetPointOrDirection)){
            // 重载一: IPoint类型
            const targetPoint = targetPointOrDirection
            if(TetrisRule.canIMove(tetris.shape, targetPoint, exists)){// 如果可以移动就让他移动
                tetris.centerPoint = targetPoint;
                return true;
            }
            return false;
        }else{
            // 重载二: IMoveDirection类型
            const direction = targetPointOrDirection;
            let targetPoint: IPoint;
            if(direction === IMoveDirection.left){
                targetPoint = {
                    x: tetris.centerPoint.x - 1,
                    y: tetris.centerPoint.y
                }
            }
            else if(direction === IMoveDirection.right){
                targetPoint = {
                    x: tetris.centerPoint.x + 1,
                    y: tetris.centerPoint.y
                }
            }else{
                targetPoint = {
                    x: tetris.centerPoint.x,
                    y: tetris.centerPoint.y + 1
                }
            }
            return this.move(tetris, targetPoint, exists)
        }
    }

    /**
     * 将当前的方块，移动到目标方向的终点
     * @param tetris
     * @param direction
     */
    static moveDirectly(tetris: SquareGroup, direction: IMoveDirection, exists: Square[]){
        while (this.move(tetris, direction, exists)) {
        }
    }

    /**
     * 旋转
     * @param tetris
     */
    static rotate(tetris: SquareGroup, exists: Square[]): boolean {
        const newShape = tetris.afterRotateShape();// 得到旋转之后新的形状
        if(this.canIMove(newShape, tetris.centerPoint, exists)){
            tetris.rotate();
            return true;
        }else{
            return false;
        }
    }

    /**
     * 从已存在的方块中进行消除，并返回消除的行数
     * @param exists
     */
    static deleteSquares(exists: Square[]): number {
        // 1. 获得y坐标数组
        const ys = exists.map(sq => sq.point.y);
        // 2. 获取最大和最小的y坐标
        const max = Math.max(...ys);
        const min = Math.min(...ys);
        // 3. 循环判断每一行是否可以消除
        let num = 0;
        for (let y = min; y <= max; y++) {
            const isDel = this.deleteLine(exists, y);
            if(isDel){// 消除了一行
                num++;
            }
        }
        return num;
    }

    /**
     * 消除一行
     * @param exists
     * @param y
     */
    private static deleteLine(exists: Square[], y: number): boolean {
        const squares = exists.filter(sq => sq.point.y === y);// y这一行的小方块数组
        if(squares.length === GameConfig.panelSize.width){// 数组长度等于界面宽度说明此行占满
            // 1. 这一行可以消除
            squares.forEach(sq => {
                // 1. 从界面中移除
                if(sq.viewer){
                    sq.viewer.remove();
                }
                // 2. 从数组中移除
                const index = exists.indexOf(sq);
                exists.splice(index, 1);
            })
            // 2. 剩下的，y坐标比当前的y小的方块，y+1
            exists.filter(sq => sq.point.y < y).forEach(sq => {
                sq.point = {
                    x: sq.point.x,
                    y: sq.point.y + 1
                }
            })
            return true;
        }
        return false;
    }
}