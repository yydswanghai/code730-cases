import { http } from './http'

export function upload(data: any) {
    return http.request({
        method: 'post',
        url: '/upload',
        data,
    })
}