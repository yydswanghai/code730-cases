import { Square } from "./Square"
import { IPoint, IShape } from "./types"

/**
 * 组合方块
 */
export class SquareGroup {
    private _squares: readonly Square[]// 方块组

    constructor(
        private _shape: IShape,// 形状
        private _centerPoint: IPoint,// 中心点
        private _color: string// 颜色
    ){
        // 设置小方块的数组
        const arr: Square[] = [];
        this._shape.forEach(p => {
            const sq = new Square();
            sq.color = this._color;
            arr.push(sq);
        })
        this._squares = arr;
        this.setSquarePoints();
    }

    get squares(){
        return this._squares;
    }
    get shape(){
        return this._shape;
    }
    get centerPoint(){
        return this._centerPoint;
    }
    set centerPoint(val){
        this._centerPoint = val;
        this.setSquarePoints();
    }

    /**
     * 根据中心点坐标，以及形状，设置每一个小方块的坐标
     */
    private setSquarePoints(){
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
        })
    }

    /**
     * 旋转方向是否为顺时针，让子类自己去控制不同的旋转
     */
    protected isClock = true;

    afterRotateShape(): IShape{
        if(this.isClock){
            return this._shape.map(p => {
                const newPoint: IPoint = {
                    x: -p.y,
                    y: p.x
                }
                return newPoint
            })
        }else{
            return this._shape.map(p => {
                const newPoint: IPoint = {
                    x: p.y,
                    y: -p.x
                }
                return newPoint
            })
        }
    }

    rotate(){
        const newShape = this.afterRotateShape();
        this._shape = newShape;
        this.setSquarePoints();
    }
}