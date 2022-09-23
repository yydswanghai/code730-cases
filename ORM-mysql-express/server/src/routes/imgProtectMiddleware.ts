import { parse } from 'url'
import { extname } from 'path'
/**
 * 图片防盗链
 * 主要通过判断请求头：Host 与 Referer 是否相同
 */

export default function (req, res, next) {
    const host = req.headers.host;
    let referer = req.headers.referer;
    // 仅处理图片
    const extName = extname(req.path);
    const whiteList = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if(!whiteList.includes(extName)){// 请求的不是图片，允许盗链
        next();
        return;
    }
    if(referer){
        referer = parse(referer).host;
    }
    if(host !== referer){
        req.url = '/img/404.jpeg';// url 重写
    }
    next();
}