import { ParameterizedContext, Next } from 'koa'
import { resolve, join } from 'path'
import { promises, createReadStream } from 'fs'
import mime from 'mime'

// 用于获取文件路径
async function getFileName(urlPath: string, root: string): Promise<string | null> {
    const subPath = urlPath.replace(/^\//, '')
    const filename = resolve(root, subPath)
    try {
        const stat = await promises.stat(filename)
        if(stat.isDirectory()){// 是目录
            const newUrlPath = join(urlPath, 'index.html')
            return await getFileName(newUrlPath, root);
        }else{// 是文件
            return filename;
        }
    } catch {// 文件不存在
        return null;
    }
}
/**
 * 静态资源加载
 */
export default function (root: string) {
    return async function (ctx: ParameterizedContext, next: Next) {
        if(ctx.method !== 'GET'){
            await next();
            return;
        }
        const filename = await getFileName(ctx.path, root)
        if(!filename){
            await next();
            return;
        }
        const type = mime.getType(filename)
        ctx.body = createReadStream(filename);
        ctx.type = type!
    }
}