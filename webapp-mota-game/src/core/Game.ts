import { Map } from './Map'
import { IGameViewer, IGameStatus } from './types'
/**
 * 游戏类
 */
export class Game {
    // 游戏状态
    private _gameStatus: IGameStatus = IGameStatus.init
    constructor(
        private _curMap: Map,// 当前游戏map
        private _viewer: IGameViewer// 显示者
    ){
        this._viewer.init(this);
    }
}