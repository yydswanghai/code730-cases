/**
 * 玩家属性类
 */
export class Player {
    private _attack: number = 100// 初始攻击力
    private _hp: number = 1000// 初始生命值
    private _key: number = 0// 初始化背包钥匙

    get HP(){
        return this._hp;
    }
    set HP(val: number){
        this._hp = val;
    }
    get attack(){
        return this._attack;
    }
    set attack(val: number){
        this._attack = val;
    }
    get key(){
        return this._key;
    }
    set key(val: number){
        this._key = val;
    }
}