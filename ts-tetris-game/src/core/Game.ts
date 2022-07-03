import GameConfig from "./GameConfig"
import { Square } from "./Square"
import { SquareGroup } from "./SquareGroup"
import { createTetris } from "./Tetris"
import { TetrisRule } from "./TetrisRule"
import { IGameStatus, IGameViewer, IMoveDirection } from "./types"

export class Game {
    // 游戏状态
    private _gameStatus: IGameStatus = IGameStatus.init
    // 当前玩家操作的方块
    private _curTetris?: SquareGroup
    // 下一个方块
    private _nextTetris: SquareGroup
    // 计时器，浏览器环境里定时器为number类型，为了避免node里判断出定时器类型建议删除node_modules/@types/node目录
    private _timer?: number
    // 自动下落的间隔时间
    private _duration: number
    // 当前游戏中，已存在的小方块
    private _exists: Square[] = []
    // 积分
    private _score: number = 0

    constructor(
        private _viewer: IGameViewer,// 显示者
    ){
        this._nextTetris = createTetris({ x: 0, y: 0 });//没有实际含义的代码，只是为了不让TS报错
        this.createNext();
        this._viewer.init(this);
        this._viewer.showScore(this.score);
        this._duration = GameConfig.levels[0].duration;
    }

    get score(){
        return this._score;
    }
    set score(val){
        this._score = val;
        this._viewer.showScore(val);
        // 分数改变时 => 游戏级别改变 => 下落速度改变
        const level = GameConfig.levels.filter(it => it.score <= val ).pop()!;
        if(level.duration === this._duration){
            return;
        }
        this._duration = level.duration;
        if(this._timer){
            clearInterval(this._timer);
            this._timer = undefined;
            this.autoDrop();
        }
    }

    get gameStatus(){
        return this._gameStatus;
    }

    // 创建下一个方块
    private createNext(){
        this._nextTetris = createTetris({ x: 0, y: 0 });// 创建下一个方块
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTetris);// 设置下一个方块中心点
        this._viewer.showNext(this._nextTetris);// 显示下一个方块对象
    }
    // 初始化
    private init(){
        this._exists.forEach(sq => {
            if(sq.viewer){
                sq.viewer.remove();
            }
        })
        this._exists = [];
        this.createNext();
        this._curTetris = undefined;
        this._score = 0;
    }

    /**
     * 游戏开始
     */
    start(){
        // 正在游戏中，直接返回
        if(this._gameStatus === IGameStatus.playing){
            return;
        }
        // 从游戏结束到开始
        if(this._gameStatus === IGameStatus.over){
            // 初始化操作
            this.init();
        }
        this._gameStatus = IGameStatus.playing;
        if(!this._curTetris){
            // 给当前玩家操作的方块赋值
            this.switchTetris();
        }
        this.autoDrop();
        this._viewer.onGameStart();
    }

    /**
     * 游戏暂停
     */
    pause(){
        if(this._gameStatus === IGameStatus.playing){
            this._gameStatus = IGameStatus.pause;
            clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGamePause();
        }
    }

    /**
     * 自由下落
     */
    private autoDrop(){
        if(this._timer || this._gameStatus !== IGameStatus.playing){
            return;
        }
        this._timer = setInterval(() => {
            if(this._curTetris){
                // 移动失败说明 —— 触底
                const isTouchTheBottom = TetrisRule.move(this._curTetris, IMoveDirection.down, this._exists);
                if(!isTouchTheBottom){
                    this.hitBottom();
                }
            }
        }, this._duration)
    }

    /**
     * 切换方块
     */
    private switchTetris(){
        this._curTetris = this._nextTetris;// 下一个变成当前
        this._curTetris.squares.forEach(sq => {
            if(sq.viewer){
                sq.viewer.remove()
            }
        })
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTetris);

        // 有可能出问题，当前方块一出现时，就已经和之前的方块重叠了
        const isMove = TetrisRule.canIMove(this._curTetris.shape, this._curTetris.centerPoint, this._exists);
        if(!isMove){
            // 游戏结束
            this._gameStatus = IGameStatus.over;
            clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGameOver();
            return;
        }

        this.createNext();
        this._viewer.swtich(this._curTetris);// 显示者切换
    }

    /**
     * 设置中心点坐标，已达到让该方块出现在区域的中上方
     */
    private resetCenterPoint(width: number, tetris: SquareGroup){
        const x = Math.ceil(width / 2) - 1;
        const y = 0;
        tetris.centerPoint = { x, y };
        // 可能出现死循环，所以直接强制移动，不要用move
        while(tetris.squares.some(it => it.point.y < 0)){
            tetris.centerPoint = {
                x: tetris.centerPoint.x,
                y: tetris.centerPoint.y + 1
            }
        }
    }

    // 控制向左移动
    controlLeft(){
        if(this._curTetris && this._gameStatus == IGameStatus.playing){
            TetrisRule.move(this._curTetris, IMoveDirection.left, this._exists)
        }
    }
    // 控制向右移动
    controlRight(){
        if(this._curTetris && this._gameStatus == IGameStatus.playing){
            TetrisRule.move(this._curTetris, IMoveDirection.right, this._exists)
        }
    }
    // 控制向下移动
    controlDown(){
        if(this._curTetris && this._gameStatus == IGameStatus.playing){
            const isTouchTheBottom = TetrisRule.move(this._curTetris, IMoveDirection.down, this._exists);
            // 触底
            if(!isTouchTheBottom){
                this.hitBottom();
            }
        }
    }
    // 控制加速向下移动
    controlAccDown(){
        if(this._curTetris && this._gameStatus == IGameStatus.playing){
            TetrisRule.moveDirectly(this._curTetris, IMoveDirection.down, this._exists);
            // 触底
            this.hitBottom();
        }
    }
    // 控制旋转
    controlRotate(){
        if(this._curTetris && this._gameStatus == IGameStatus.playing){
            TetrisRule.rotate(this._curTetris, this._exists)
        }
    }

    /**
     * 触底之后的操作
     */
    private hitBottom(){
        // 将当前的俄罗斯方块包含的小方块，加入到已存在的方块数组中。
        this._exists = this._exists.concat(this._curTetris!.squares);
        // 处理移除
        const num = TetrisRule.deleteSquares(this._exists);
        // 增加积分
        this.addScore(num);
        // 切换方块
        this.switchTetris();
    }

    /**
     * 增加积分
     */
    private addScore(lineNum: number){
        if(lineNum === 0){
            return;
        }
        else if(lineNum === 1){
            this.score += 10;
        }
        else if(lineNum === 2){
            this.score += 25;
        }
        else if(lineNum === 3){
            this.score += 50;
        }else{
            this.score += 100;
        }
    }
}