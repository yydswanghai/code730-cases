
import { gaussBlur } from "./gaussBlur"
import { setBlackAndWhite } from "./setBlackAndWhite";

/**
 * 画布中的1个图像是由多个像素点组成，每个像素点拥有4个数据：红、绿、蓝、alpha
 * 把一个图像变成黑白，只需要将图像的每个像素点设置成为红绿蓝的平均数即可
 */

function init() {
    const img = document.querySelector('img');
    const cvs = document.querySelector("canvas");
    const blurBtn = document.querySelector('#blurBtn');
    const BAndWBtn = document.querySelector('#BAndWBtn');
    if(!img){
        console.log('找不到img元素')
        return;
    }
    if(!cvs){
        console.log('找不到canvas元素')
        return;
    }

    const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;

    blurBtn?.addEventListener('click', function () {
        ctx.drawImage(img, 0, 0);
        //得到画布某一个区域的图像信息
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const imgData = gaussBlur(imageData);
        //将图像数据设置到画布
        ctx.putImageData(imgData, 0, 0);
    })
    BAndWBtn?.addEventListener('click', function () {
        ctx.drawImage(img, 0, 0);
        //得到画布某一个区域的图像信息
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const imgData = setBlackAndWhite(imageData);
        //将图像数据设置到画布
        ctx.putImageData(imgData, 0, 0);
    })
}

init();