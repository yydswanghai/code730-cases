import { Game } from './Game'
/**
 * 0: 空白
 * 1: 玩家
 * 2: 墙
 * 3: 门
 * 4: 钥匙
 * 5: 楼梯
 * 6: 血瓶(红色)
 * 7: 血瓶(紫色)
 * 8: 装备(武器)
 * 9: 装备(法杖)
 * 10: 装备(武器max)
 * 11: 装备(护甲)
 * 12: 符文(红色)
 * 13: 符文(紫色)
 * 14: Boss
 * 15: 小怪(史莱姆绿)
 * 16: 小怪(史莱姆红)
 * 17: 小怪(紫色蝙蝠)
 * 18: 小怪(紫色巫师)
 * 19: 小怪(普通骷髅)
 * 20: 小怪(盾牌骷髅)
 */
export enum IMapElement {
    space,
    player,
    wall,
    door,
    key,
    stairs,
    blood_red,
    blood_purple,
    weaponry,
    weaponry_staff,
    weaponry_max,
    equipment_armor,
    rune_red,
    rune_purple,
    boss,
    monster_shrem_green,
    monster_shrem_red,
    monster_bat,
    monster_wizard,
    monster_human_skeleton,
    monster_human_skeleton2
}
/**
 * 游戏状态
 */
export enum IGameStatus {
    init,    // 未开始
    playing, // 进行中
    pause,   // 暂停
    over     // 游戏结束
}
/**
 * 正确位置
 */
export interface ICorrect {
    row: number
    col: number
}
export interface ICorrectInfo extends ICorrect {
    value: number
}
/**
 * ui显示者
 */
export interface IViewer {
    showUI(): void
}
export type IDirection = 'left' | 'right' | 'up' | 'down'
/**
 * game显示者
 */
export interface IGameViewer {
    /**
     * 完成界面的初始化
     */
    init(game: Game): void
}