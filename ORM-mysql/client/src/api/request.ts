import axios from 'axios'
import type { AxiosInstance } from 'axios'

// 加载环境变量
const { VITE_PROXY_PATH } = import.meta.env;

export default function () {
    //1. 发送请求的时候，如果有token，需要附带到请求头中
    const token = localStorage.getItem("token");
    let instance: AxiosInstance = axios;
    if (token) {
        instance = axios.create({
            baseURL: VITE_PROXY_PATH,
            timeout: 10 * 1000,// 请求超时时间
            withCredentials: true, // 当跨域请求时发送cookie
            headers: {
                authorization: "bearer " + token,
            },
        });
    }
    instance.interceptors.request.use(config => {
        return config;
    },error => {
        return Promise.reject(error);
    })

    instance.interceptors.response.use(response => {
        //2. 响应的时候，如果有token，保存token到本地（localstorage）
        if (response.headers.authorization) {
            localStorage.setItem("token", response.headers.authorization);
        }
        return response.data;
    },error => {
         //3. 响应的时候，如果响应的消息码是403（没有token，token失效），在本地删除token
        if (error.response.status === 403) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    })

    return instance;
}