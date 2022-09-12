import axios from 'axios'
import { load } from 'cheerio'
import Book from '../models/Book'
/**
 * 获取豆瓣读书网页的源代码
 */
async function getBooksHTML() {
    const resp = await axios.get('https://book.douban.com/latest')
    return resp.data;
}
/**
 * 从豆瓣读书中得到一个完整的网页，并从网页中分析出书籍的基本信息，然后得到一个书籍的详情页链接数组
 */
async function getBookLinks(){
    const html = await getBooksHTML()
    const $ = load(html)
    const achorElements = $('#content .chart-dashed-list li .media__img a')
    const links = achorElements.map((i, ele) => {
        const href = ele.attribs['href']
        return href
    }).get()
    return links;
}

/**
 * 根据书籍详情页的地址，得到该书籍的详细信息
 * @param {*} detailUrl
 */
async function getBookDetail(detailUrl: string){
    const resp = await axios.get(detailUrl)
    const $ = load(resp.data)
    const name = $('h1').text().trim()
    const imgurl = $('#mainpic .nbg img').attr('src')
    const spans = $('#info span.pl')
    const authorSpan = spans.filter((i, ele) => {
        return $(ele).text().includes("作者");
    })
    const author = authorSpan.next("a").text()
    const publishSpan = spans.filter((i, ele) => {
        return $(ele).text().includes("出版年");
    })
    const publishDate = (publishSpan[0] as any).nextSibling.nodeValue.trim()
    return {
        name,
        imgurl,
        publishDate,
        author,
    }
}

/**
 * 获取所有的书籍信息
 */
async function fetchAll() {
    const links = await getBookLinks();
    const proms = links.map(link => {
        return getBookDetail(link)
    })
    return Promise.all(proms);
}

/**
 * 得到书籍信息，然后保存到数据库
 */
export async function saveToDB(){
    const books = await fetchAll();
    await Book.bulkCreate(books);
    console.log('抓取数据并保存到数据库完成')
}