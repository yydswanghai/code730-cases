import { SquareGroup } from "../SquareGroup"
import { IGameStatus, IGameViewer } from "../types"
import { SquarePageViewer } from "./SquarePageViewer"
import $ from "jquery"
import { Game } from "../Game"
import GameConfig from "../GameConfig"
import PageConfig from "./PageConfig"

export class GamePageViewer implements IGameViewer {
    private panelDom = $('#panel')
    private nextDom = $('#next')
    private scoreDom = $('#score')
    private msgDom = $('#msg')

    showNext(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, this.nextDom)
        })
    }
    swtich(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer?.remove();
            sq.viewer = new SquarePageViewer(sq, this.panelDom)
        })
    }
    init(game: Game): void {
        // 1. 设置宽高
        this.panelDom.css({
            width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
            height: GameConfig.panelSize.height * PageConfig.SquareSize.height
        })

        this.nextDom.css({
            width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
            height: GameConfig.nextSize.height * PageConfig.SquareSize.height
        })

        // 2. 设置键盘事件
        $(document).keydown(function (e) {
            if(e.keyCode === 37){
                game.controlLeft()
            }
            else if(e.keyCode === 39){
                game.controlRight()
            }
            else if(e.keyCode === 38){
                game.controlRotate()
            }
            else if(e.keyCode === 40){
                game.controlDown()
            }
            else if(e.keyCode === 32){
                game.controlAccDown()
            }
            else if(e.keyCode === 13){
                if(game.gameStatus === IGameStatus.playing){
                    game.pause()
                }
                else{
                    game.start()
                }
            }
        })
    }
    showScore(score: number): void {
        this.scoreDom.html(score.toString())
    }
    onGameStart(): void {
        this.msgDom.css({ display: 'none' })
    }
    onGamePause(): void {
        this.msgDom.css({ display: 'flex' })
        this.msgDom.find("img").attr('src', './imgs/pause.png')
        this.msgDom.find("p").html("游戏暂停")
    }
    onGameOver(): void {
        this.msgDom.css({ display: 'flex' })
        this.msgDom.find("img").attr('src', './imgs/start.png')
        this.msgDom.find("p").html("游戏结束")
    }
}