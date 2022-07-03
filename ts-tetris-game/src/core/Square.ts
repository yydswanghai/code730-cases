import { IPoint, IViewer } from "./types"

/**
 * 小方块类
 */
export class Square {
    private _point: IPoint = {
        x: 0, y: 0
    }
    private _color: string = ""

    // 显示者
    private _viewer?: IViewer

    get point() {
        return this._point;
    }
    set point(val){
        this._point = val;
        // 完成显示
        if(this._viewer){
            this._viewer.show();
        }
    }
    get color(){
        return this._color;
    }
    set color(val){
        this._color = val;
    }
    get viewer(){
        return this._viewer;
    }
    set viewer(val){
        this._viewer = val;
        if(val){// 设置显示，默认显示一次
            val.show();
        }
    }
}