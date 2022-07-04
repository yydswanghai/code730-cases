import { descriptor, printObj } from "./Descriptor"

@descriptor("文章")
class Article {
    @descriptor("标题")
    title: string

    @descriptor("内容")
    content: string

    @descriptor("日期")
    data: Date
}

const art = new Article();
art.title = "今日****";
art.content = "当前****";
art.data = new Date();

printObj(art);