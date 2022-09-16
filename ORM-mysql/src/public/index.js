/**
 * jsonp跨域
 */
// function runtimejsonp() {
//     const url = 'http://localhost:9525/api/student/jsonp';
//     const script  = document.createElement('script');
//     script.setAttribute('src', url);
//     document.body.appendChild(script)
//     script.onload = function () {
//         script.remove()
//     }
// }

// function callback(data) {
//     console.log(data)
// }

// runtimejsonp()

/**
 * cors跨域 - 简单请求
 */
// fetch('http://localhost:9525/api/student')
// .then(res => res.json())
// .then(res => console.log(res))
/**
 * cors跨域 - 预检请求
 */
// fetch('http://localhost:9525/api/student', {
//     method: 'POST',
//     headers: {
//         a: 1,
//         'content-type': 'application/json'
//     },
// })
// .then(res => res.json())
// .then(res => console.log(res))
/**
 * cors跨域 - 附带身份凭证的请求
 */
// fetch('http://localhost:9525/api/student', {
//     method: 'POST',
//     headers: {
//         a: 1,
//         'content-type': 'application/json'
//     },
//     credentials: 'include'
// })
// .then(res => res.json())
// .then(res => console.log(res))

function login() {
    fetch('http://localhost:9525/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ loginId: 'abc', loginPwd: '123123' }),
    })
    .then(res => res.json())
    .then(res => console.log(res))
}

function update() {
    fetch('http://localhost:9525/api/student/502', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: '墨菲史' }),
    }).then(res => res.json())
    .then(res => console.log(res))
}