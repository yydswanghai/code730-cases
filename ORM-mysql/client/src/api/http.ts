import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 加载环境变量
const { VITE_PROXY_PATH } = import.meta.env;

export interface Result {
    code: number
    msg: string
}

export interface ResultData<T = any> extends Result {
    data?: T
}

export enum RequestEnums {
    TIMEOUT = 20000,// 超时时间
    SUCCESS = 0,// 成功响应
    OVERDUE = 403// 令牌过期
}

class RequestHttp {
    service: AxiosInstance;
    constructor(){
        /**
         * 创建 axios 实例
         */
        this.service = axios.create({
            baseURL: VITE_PROXY_PATH,
            timeout: RequestEnums.TIMEOUT,
            withCredentials: true// 跨域时候允许携带凭证
        })
        /**
         * 请求拦截
         */
        this.service.interceptors.request.use((config: AxiosRequestConfig) => {
             //1. 发送请求的时候，如果有token，需要附带到请求头中
            const token = localStorage.getItem("token");
            let headers: any = {};
            if(token){
                headers.authorization = `bearer ${token}`
            }
            return {
                ...config,
                headers
            }
        },error => {
            return Promise.reject(error);
        })
        /**
         * 响应拦截
         */
        this.service.interceptors.response.use((resp: AxiosResponse) => {
            //2. 响应的时候，如果有token，保存token到本地（localstorage）
            if (resp.headers.authorization) {
                localStorage.setItem("token", resp.headers.authorization);
            }
            return resp.data;
        },error => {
             //3. 响应的时候，如果响应的消息码是403（没有token，token失效），在本地删除token
            if (error.response.status === RequestEnums.OVERDUE) {
                localStorage.removeItem("token");
            }
            return Promise.reject(error);
        })
    }

    // 常用方法封装
    get<T>(url: string, params?: object): Promise<ResultData<T>> {
       return this.service.get(url, {params});
    }
    post<T>(url: string, params?: object): Promise<ResultData<T>> {
       return this.service.post(url, params);
    }
    put<T>(url: string, params?: object): Promise<ResultData<T>> {
       return this.service.put(url, params);
    }
    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
       return this.service.delete(url, {params});
    }

    request(config: AxiosRequestConfig<any>): Promise<ResultData<any>>{
        return this.service.request(config)
    }
}

export const http = new RequestHttp()