import React from "react"
import { ChessType } from "../types/enums"
import { ChessComp } from "./ChessComp"
import "./BoardComp.css"

export interface IProps {
    chesses: ChessType[]
    isGameOver?: boolean
    onClick?: (index: number) => void
}

export const BoardComp: React.FC<IProps> = function (props) {
    const isGameOver = props.isGameOver!;// as boolean 非空断言

    const list = props.chesses.map((type, i) => <ChessComp
        key={i}
        type={type}
        onClick={() => {
            if(props.onClick && !isGameOver){
                props.onClick(i);
            }
        }}
    />)
    return (
        <div className="board">
            {list}
        </div>
    )
}

BoardComp.defaultProps = {
    isGameOver: false
}