import { Next, ParameterizedContext } from 'koa'
import { parse } from 'url'
import { extname } from 'path'
/**
 * 图片防盗链
 * 主要通过判断请求头：Host 与 Referer 是否相同
 */
export default async function (ctx: ParameterizedContext, next: Next){
    const host = 'localhost:9525' || ctx.request.header.host;
    let referer: any = ctx.request.header.referer;
    // 仅处理图片
    const extName = extname(ctx.path);
    console.log(host, referer, ctx.url)
    const whiteList = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if(!whiteList.includes(extName)){// 请求的不是图片，允许盗链
        await next();
        return;
    }
    if(referer){
        referer = parse(referer).host;
    }

    if(host !== referer){
        ctx.url = '/404.jpeg';
    }
    await next()
}