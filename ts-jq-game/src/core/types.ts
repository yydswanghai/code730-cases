import { SquareGroup } from "./SquareGroup"

export interface IPoint {
    x: number
    y: number
}

export interface IViewer {
    /**
     * 显示
     */
    show(): void
    /**
     * 移除，不再显示
     */
    remove(): void
}
/**
 * 形状
 */
export type IShape = IPoint[]

/**
 * 移动方向
 */
export enum IMoveDirection {
    left,
    right,
    down
}

/**
 * 游戏状态
 */
export enum IGameStatus {
    init, //未开始
    playing, //进行中,
    pause, //暂停
    over //游戏结束
}

export interface IGameViewer {
    /**
     * @param teris 下一个方块对象
     */
    showNext(teris: SquareGroup): void;
    /**
     * @param teris 切换的方块对象
     */
    swtich(teris: SquareGroup): void;
}