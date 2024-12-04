export type callback<K, V> = (key: K, val: V) => void
// callback的<K, V> 与 Dictionary的<K, V> 没有任何关系
export class Dictionary<K, V> {
    private keys: K[] = [];
    private vals: V[] = [];

    get size(){
        return this.keys.length;
    }

    set(key: K, val: V){
        const index = this.keys.indexOf(key);
        if(index < 0){
            this.keys.push(key);
            this.vals.push(val);
        }else{
            this.vals[index] = val;
        }
    }

    forEach(callback: callback<K, V>){
        this.keys.forEach((k, i) => {
            const v = this.vals[i];
            callback(k, v);
        })
    }

    has(key: K){
        return this.keys.includes(key);
    }

    delete(key: K){
        const index = this.keys.indexOf(key);
        if(index === -1){
            return;
        }
        this.keys.splice(index, 1);
        this.vals.splice(index, 1);
    }

    print(){
        this.forEach((k, v) => {
            console.log(`${k}:${v}`)
        })
    }
}