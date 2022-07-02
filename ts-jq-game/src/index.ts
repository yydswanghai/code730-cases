import $ from "jquery"
import { Game } from "./core/Game"
import { GamePageViewer } from "./core/viewer/GamePageViewer"

const g = new Game(new GamePageViewer())
g.start()