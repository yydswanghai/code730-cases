console.log(12345613)

fetch('/api/admin/oauth/token?grant_type=password&scope=app&type=1', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'bearer ' + btoa('app_1:9d4f7428-7ecb-48bd-9f02-2edce91c88f6')
    },
    body: Qs.stringify({ loginId: 'admin', loginPwd: 'admin' })
})

// axios.request({
//     method: 'post',
//     url: '/api/admin/oauth/token',
//     headers: { 'content-type': 'application/x-www-form-urlencoded' },
//     params: {
//         grant_type: 'password',
//         scope: 'app',
//         type: '1',
//     },
//     data: Qs.stringify({
//         loginId: 'admin',
//         loginPwd: 'admin',
//     })
// })