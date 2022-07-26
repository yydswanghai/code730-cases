class Queue<T> {
    private _count: number = this.items.length
    private _lowestCount: number = 0// 用来追踪第一个元素
    constructor(public items: Array<T> = []) {}

    enqueue(element: T){// 向队列尾部添加元素 (一个或多个)
        this.items[this._count] = element;
        this._count++;
    }
    dequeue(){// 移除队列的第一项
        if(this.isEmpty()){
            return undefined;
        }
        const result = this.items[this._lowestCount];
        delete this.items[this._lowestCount];
        this._lowestCount++;
        return result;
    }
    peek(){// 返回队列中第一个元素
        if(this.isEmpty()){
            return undefined;
        }
        return this.items[this._lowestCount];
    }
    isEmpty(){// 判断队列是否为空
        return this.size() === 0;
    }
    size(){// 返回队列里的元素个数
        return this._count - this._lowestCount;
    }
    clear(){// 移除队列里的所有元素
        this.items = [];
        this._count = 0;
        this._lowestCount = 0;
    }
    toString(){
        if(this.isEmpty()){
            return '';
        }
        let objString = `${this.items[this._lowestCount]}`;
        for (let i = this._lowestCount + 1; i < this._count; i++) {
            objString = `${objString},${this.items[i]}`
        }
        return objString;
    }
}

const queue = new Queue();
queue.enqueue('A');
queue.enqueue('B');
queue.enqueue('C');
queue.enqueue({ age: 12 });
queue.dequeue();
console.log(queue);
console.log(queue.toString());