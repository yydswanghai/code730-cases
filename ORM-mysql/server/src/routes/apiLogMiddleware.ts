import { apiLogger } from '../utils/logger'
import { connectLogger } from 'log4js'

/**
 * 自定义日志
 */
// export default (req, res, next) => {
//     next();
//     apiLogger.debug(`${req.method} ${req.path} ${req.ip}`)
// }

export default connectLogger(apiLogger, {
    level: 'auto'
})