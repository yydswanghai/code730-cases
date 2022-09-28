console.log(12345613)

fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ loginId: 'abc', loginPwd: '' })
})
.then(r => r.json())
.then(res => {
    console.log(res)
})