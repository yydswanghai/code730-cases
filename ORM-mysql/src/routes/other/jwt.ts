import jwt from 'jsonwebtoken'

const secrect = 'fe-84de-22d21ca71e43'
const cookieKey = 'token'

/**
 * 颁发jwt
 */
export function jwtPublish(res, info = {}, maxAge = 3600 * 24) {
    const token = jwt.sign(info, secrect, {
        expiresIn: maxAge
    })
    // 添加到cookie
    res.cookie(cookieKey, token, {
        maxAge: maxAge * 1000,
        path: '/'
    })
    // 添加其他传输
    res.header('authorization', token);
}

/**
 * 认证jwt
 */
export function jwtVerify(req) {
    let token;
    // 1.尝试用cookie中获取
    token = req.cookies[cookieKey];
    if(!token){
        // 2. 尝试从header中获取
        token = req.headers.authorization;
    }
    if(!token){
        // 没有token
        return null;
    }
    // authorization: bearer token
    token = token.split(' ');
    token = token.length === 1 ? token[0] : token[1];
    try {
        const result = jwt.verify(token, secrect);
        return result;
    } catch (error) {
        return null;
    }
}