import { showUi } from './ui'
import { playerMove, isWin } from './play'

showUi();
var gameover = false;

window.onkeydown = function(e: KeyboardEvent){
    if(gameover){
        return;
    }
    var result = false;
    if(e.key === 'ArrowUp'){
        result = playerMove('up');
    }
    else if(e.key === 'ArrowDown'){
        result = playerMove('down');
    }
    else if(e.key === 'ArrowLeft'){
        result = playerMove('left');
    }
    else{
        result = playerMove('right');
    }

    if(result){
        showUi();
        if(isWin()){
            alert('游戏结束')
            gameover = true;
        }
    }
}