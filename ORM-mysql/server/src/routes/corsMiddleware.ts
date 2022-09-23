import cors from 'cors'

const whiteList = ['null', 'http://localhost:9525', 'http://localhost:8808']

export default cors({
    origin(origin, callback){
        // if(!origin){
        //     callback(null, '*');
        //     return;
        // }
        // callback(null, origin);
        if(whiteList.includes(origin) || !origin){
            callback(null, origin);
        }else{
            callback(new Error('不在白名单内 not allowed'));
        }
    },
    credentials: true
})