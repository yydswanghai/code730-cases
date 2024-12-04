import { Game } from "./Game"
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
     * @param tetris 下一个方块对象
     */
    showNext(tetris: SquareGroup): void;
    /**
     * @param tetris 切换的方块对象
     */
    swtich(tetris: SquareGroup): void;
    /**
     * 完成界面的初始化
     */
    init(game: Game): void

    showScore(score: number): void

    onGamePause(): void

    onGameStart(): void

    onGameOver(): void
}