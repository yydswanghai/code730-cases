import { Mark, Color } from "./enums";
import { Card, Deck, Joker, NormalCard } from "./types";

export function createDeck(): Deck {
    const deck: Deck = [];
    const marks = Object.values(Mark);
    const colors = Object.values(Color);
    for (const m of marks) {
        for (const c of colors) {
            // 方式一 不直接使用字面量赋值
            // const card: NormalCard = {
            //     color: c,
            //     mark: m,
            //     getString(){
            //         return this.color + this.mark
            //     }
            // }
            // deck.push(card);
            // 方式二 使用类型断言
            deck.push({
                color: c,
                mark: m,
                getString(){
                    return this.color + this.mark
                }
            } as Card);
            // 或
            // deck.push(<Card>{
            //     color: c,
            //     mark: m,
            //     getString(){
            //         return this.color + this.mark
            //     }
            // });
        }
    }
    let joker: Joker = {
        type: "small",
        getString() {
            return "jo"
        },
    }
    deck.push(joker)
    joker = {
        type: "big",
        getString() {
            return "JO"
        },
    }
    deck.push(joker)

    return deck;
}

export function printDeck(deck: Deck) {
    let result = "\n";
    deck.forEach((card, i) => {
        result += card.getString() + "\t";
        if((i + 1) % 6 === 0){
            result += "\n";
        }
    })
    console.log(result);
}