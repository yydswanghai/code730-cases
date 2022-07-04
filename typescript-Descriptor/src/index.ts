import { classDescriptor, porpDescriptor, printObj } from "./Descriptor";

@classDescriptor("用户")
class User {
    @porpDescriptor("账号")
    loginId: string

    @porpDescriptor("密码")
    loginPwd: string

    other: string
}

@classDescriptor("文章")
class Article {
    @porpDescriptor("标题")
    title: string

    @porpDescriptor("内容")
    content: string

    @porpDescriptor("日期")
    data: Date
}

const u = new User();
u.loginId = 'abc';
u.loginPwd = '123';
u.other = 'qwer'

printObj(u);

const art = new Article();
art.title = "今日****";
art.content = "当前****";
art.data = new Date();

printObj(art);