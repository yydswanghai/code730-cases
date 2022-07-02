import { SquareGroup } from "../SquareGroup"
import { IGameViewer } from "../types"
import { SquarePageViewer } from "./SquarePageViewer"
import $ from "jquery"

export class GamePageViewer implements IGameViewer {
    showNext(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, $('#panel'))
        })
    }
    swtich(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer?.remove();
            sq.viewer = new SquarePageViewer(sq, $('#next'))
        })
    }
}