import { Level1 } from './core/Level'
import { UI } from './core/UI'
import { Play } from './core/Play'
import { Player } from './core/Player'

const m1 = new Level1()
const ui = new UI(m1)
const hero = new Player()
const play = new Play(m1, hero)
ui.showUI()
play.playerMove('up')
ui.showUI()
play.playerMove('up')
ui.showUI()

console.log(m1)
