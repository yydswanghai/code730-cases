import { SquareGroup } from "./SquareGroup"
import { createTeris } from "./Teris"
import { TerisRule } from "./TerisRule"
import { IGameStatus, IGameViewer, IMoveDirection } from "./types"

export class Game {
    // 游戏状态
    private _gameStatus: IGameStatus = IGameStatus.init
    // 当前玩家操作的方块
    private _curTeris?: SquareGroup
    // 下一个方块
    private _nextTeris: SquareGroup = createTeris({x: 0, y: 0})
    // 计时器，浏览器环境里定时器为number类型，为了避免node里判断出定时器类型建议删除node_modules/@types/node目录
    private _timer?: number
    // 自动下落的间隔时间
    private _duration: number = 1000

    constructor(
        private _viewer: IGameViewer,// 显示者
    ){}

    /**
     * 游戏开始
     */
    start(){
        // 正在游戏中，直接返回
        if(this._gameStatus === IGameStatus.playing){
            return;
        }
        this._gameStatus = IGameStatus.playing;
        if(!this._curTeris){
            // 给当前玩家操作的方块赋值
            this.switchTeris();
        }
        this.autoDrop();
    }

    /**
     * 自由下落
     */
    private autoDrop(){
        if(this._timer || this._gameStatus !== IGameStatus.playing){
            return;
        }
        this._timer = setInterval(() => {
            if(this._curTeris){
                TerisRule.move(this._curTeris, IMoveDirection.down)
            }
        }, this._duration)
    }

    /**
     * 切换方块
     */
    private switchTeris(){
        this._curTeris = this._nextTeris;
        this._nextTeris = createTeris({ x: 0, y: 0 });
        this._viewer.swtich(this._curTeris);
        this._viewer.showNext(this._nextTeris);
    }
}