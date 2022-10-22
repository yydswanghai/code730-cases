import { http } from './http'
import Qs from 'Qs'

export function addBook(data: any) {
    return http.request({
        method: 'post',
        url: '/book',
        data: Qs.stringify(data),
    })
}

export function getBooks() {
    return http.request({
        method: 'get',
        url: '/book',
    })
}