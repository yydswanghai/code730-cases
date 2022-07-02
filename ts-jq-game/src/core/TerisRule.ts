import GameConfig from "./GameConfig"
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
export class TerisRule {
    /**
     * 判断某个形状的方块，是否能够移动到目标位置
     */
    static canIMove(shape: IShape, targetPoint: IPoint): boolean{
        // 当前形状在目标位置，先要将形状变换到目标位置
        const targetSquarePoints: IPoint[] = shape.map(it => {
            return {
                x: it.x + targetPoint.x,
                y: it.y + targetPoint.y
            }
        })
        // 边界判断
        const result = targetSquarePoints.some(p => {
            return p.x < 0 ||
            p.x > GameConfig.panelSize.width-1 ||
            p.y < 0 ||
            p.y > GameConfig.panelSize.height-1;
        })
        // 如果超出边界则说明不能移动返回false
        if(result){
            return false;
        }
        // 可以移动
        return true;
    }

    /**
     * 移动
     * @param teris
     * @param targetPoint 根据目标点
     * @param direction 根据方向移动
     */
    static move(teris: SquareGroup, targetPoint: IPoint): boolean
    static move(teris: SquareGroup, direction: IMoveDirection): boolean
    static move(teris: SquareGroup, targetPointOrDirection: IPoint | IMoveDirection): boolean{
        if(isPoint(targetPointOrDirection)){
            // 重载一: IPoint类型
            const targetPoint = targetPointOrDirection
            if(TerisRule.canIMove(teris.shape, targetPoint)){// 如果可以移动就让他移动
                teris.centerPoint = targetPoint;
                return true;
            }
            return false;
        }else{
            // 重载二: IMoveDirection类型
            const direction = targetPointOrDirection;
            let targetPoint: IPoint;
            if(direction === IMoveDirection.left){
                targetPoint = {
                    x: teris.centerPoint.x - 1,
                    y: teris.centerPoint.y
                }
            }
            else if(direction === IMoveDirection.right){
                targetPoint = {
                    x: teris.centerPoint.x + 1,
                    y: teris.centerPoint.y
                }
            }else{
                targetPoint = {
                    x: teris.centerPoint.x,
                    y: teris.centerPoint.y + 1
                }
            }
            return this.move(teris, targetPoint)
        }
    }

    /**
     * 将当前的方块，移动到目标方向的终点
     * @param teris
     * @param direction
     */
    static moveDirectly(teris: SquareGroup, direction: IMoveDirection){
        while (this.move(teris, direction)) {
        }
    }

    /**
     * 旋转
     * @param teris
     */
    static rotate(teris: SquareGroup): boolean {
        const newShape = teris.afterRotateShape();// 得到旋转之后新的形状
        if(this.canIMove(newShape, teris.centerPoint)){
            teris.rotate();
            return true;
        }else{
            return false;
        }
    }
}