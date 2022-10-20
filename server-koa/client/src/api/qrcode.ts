import { http } from './http'
import Qs from 'Qs'

export function getQrcode(data: { str: string }) {
    return http.request({
        method: 'post',
        url: '/qrcode',
        data: Qs.stringify(data),
    })
}