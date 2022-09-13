/**
 * 服务器API响应格式
 */
/**
 * 返回一个错误的结果
 */
export function getError(errMsg: string = 'server internal error', errCode: number = 500) {
    return {
        code: errCode,
        msg: errMsg
    }
}
/**
 * 返回一个正常的结果
 */
export function getResult(result: any) {
    return {
        code: 0,
        msg: '',
        data: result
    }
}
/**
 * 封装的自动异步处理函数
 * @param { Function } handler函数返回一个异步的结果
 * @desc 内层异步匿名函数用来收集 handler的参数
 * 因为毕竟不能这样写: asyncHandler(handle(req, res, next))
 */
export function asyncHandler(handler) {
    return async (req, res ,next) =>{
        try {
            // 无错误，直接返回正确结果
            const result = await handler(req, res, next);
            res.send(getResult(result))
        } catch (error) {
            // 出现错误，传递下去最后交给错误中间件处理
            next(error)
        }
    }
}