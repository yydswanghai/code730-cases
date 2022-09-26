import { Server } from 'socket.io'
import http from 'http'

interface User {
    username: string
    socket: any // 每个对象都有一个socket对象用于后面谁对谁发消息
}

const users: User[] = [];

export default function (server: http.Server) {
    const io = new Server()
    io.attach(server);

    io.on('connection', (socket) => {
        console.log('一个客户端连接了')
        let curUser = '';// 当前用户名
        // 监听客户端
        socket.on('login', (data: string) => {
            if(data === '所有人' || users.filter(u => u.username === data).length > 0){
                // 昵称不可用
                socket.emit('login', false);
            }else{
                // 昵称可用
                users.push({
                    username: data,
                    socket,
                })
                curUser = data;// 记录当前用户
                socket.emit('login', true);
                // 新用户进入
                socket.broadcast.emit('userin', data)
            }
        })
        socket.on('users', () => {
            const arr = users.map(u => u.username);
            socket.emit('users', arr);
        })

        socket.on('msg', (data: { to: User['username'], content: string }) => {
            if(data.to){// 发送给指定用户
                const us = users.find(u => u.username === data.to);
                if(us){
                    if(us.username === curUser){
                        // 不能自己对自己发言
                        return;
                    }
                    us.socket.emit('new msg', {
                        from: curUser,
                        content: data.content,
                        to: data.to
                    })
                }else{
                    // 用户中途退出了，而你还在对该发言
                }
            }else{// 所有人
                socket.broadcast.emit('new msg', {
                    from: curUser,
                    content: data.content,
                    to: data.to
                })
            }
        })

        socket.on('disconnect', () => {
            socket.broadcast.emit('userout', curUser);
            const index = users.findIndex(it => it.username === curUser);
            users.splice(index, 1)
        })
    })
}