export class Stack<T> {
    private _count: number = this.items.length
    constructor(public items: Array<T> = []) {}

    push(element: T){// 添加元素
        this.items.push(element);
        this._count++;
    }
    pop(){// 移除栈顶的元素
        if(this.isEmpty()){
            return undefined;
        }
        this._count--;
        return this.items.pop();
    }
    peek(){// 返回栈顶的元素
        if(this.isEmpty()){
            return undefined;
        }
        return this.items[this._count - 1];
    }
    isEmpty(){// 判断栈是否为空
        return this._count === 0;
    }
    size(){// 返回栈里的元素个数
        return this._count;
    }
    clear(){// 移除栈里的所有元素
        this.items = [];
        this._count = 0;
    }
    toString(){
        if(this.isEmpty()){
            return '';
        }
        let objString = `${this.items[0]}`;
        for (let i = 1; i < this._count; i++) {
            objString = `${objString},${this.items[i]}`
        }
        return objString;
    }
}

const stack = new Stack();
console.log(stack.isEmpty())
stack.push(5)
stack.push('a')
stack.pop()
stack.push({ name: 'dad' })
console.log(stack)