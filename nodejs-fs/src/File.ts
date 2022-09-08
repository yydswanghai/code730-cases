import fs from 'fs'
import path from 'path'

export default class File {
    constructor(
        public filename: string,
        public name: string,
        public ext: string,
        public isFile: boolean,
        public size: number,
        public createTime: Date,
        public updateTime: Date
    ) {}

    static async getFile(filename: string){
        const stat = await fs.promises.stat(filename);
        const name = path.basename(filename);
        const ext = path.extname(filename);
        const isFile = stat.isFile();
        const size = stat.size;
        const createTime = new Date(stat.birthtime);
        const updateTime = new Date(stat.mtime);
        return new File(filename, name, ext, isFile, size, createTime, updateTime)
    }

    async getContent(isBuffer = false){
        if(this.isFile){
            if(isBuffer){
                return await fs.promises.readFile(this.filename)
            }else{
                return await fs.promises.readFile(this.filename, 'utf-8')
            }
        }
        return null;
    }

    async getChildren(){
        if(this.isFile){
            return [];// 文件不可能有子文件
        }
        let children: any[] = await fs.promises.readdir(this.filename);
        children = children.map(name => {
            const result = path.resolve(this.filename, name);
            return File.getFile(result);
        })
        return Promise.all(children);
    }
}