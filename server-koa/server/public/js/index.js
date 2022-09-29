console.log(12345613)

fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ loginId: 'admin', loginPwd: 'admin' })
})
.then(r => r.json())
.then(res => {

})

// fetch('/api/admin/whoami', {
//     method: 'GET',
// }).then(r => r.json())