import { extend, validators } from 'validate.js'
import { utc } from 'moment'

extend(validators.datetime, {
    /**
     * 该函数会自动用于日期格式转换
     * 它会在验证时自动触发，它需要将任何数据转换为时间戳返回
     * 如果无法转换，返回NaN
     * @param {*} value 传入要转换的值
     * @param {*} options 针对某个属性的验证配置
     */
    parse(value, options){
        let formats = ['YYYY-MM-DD HH:mm:ss', 'yyyy-M-D H:m:s', 'x'];
        if(options.dateOnly){// 如果设置了只允许日期
            formats = ['YYYY-MM-DD', 'yyyy-M-D', 'x'];
        }
        return +utc(value, formats, true);// moment的日期格式验证
    },
    /**
     * 用户显示错误消息时，使用的显示字符串
     */
    format(value, options){
        let formats = 'YYYY-MM-DD';
        if(!options.dateOnly){// 没有设置只允许日期，则为日期时间
            formats += " HH:mm:ss"
        }
        return +utc(value).format(formats);
    }
})