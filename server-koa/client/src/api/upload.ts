import { http } from './http'

export function upload(data: any) {
    return http.request({
        method: 'post',
        url: '/upload',
        data,
    })
}

export function uploadMultiple(data: any) {
    return http.request({
        method: 'post',
        url: '/uploads',
        data,
    })
}

export function upload2water(data: any) {
    return http.request({
        method: 'post',
        url: '/upload2water',
        data,
    })
}