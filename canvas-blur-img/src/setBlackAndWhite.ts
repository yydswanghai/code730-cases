/**
 * 设置成黑白照
 */
export function setBlackAndWhite(imgData: ImageData): ImageData {
    for (let i = 0; i < imgData.data.length; i += 4) {// 每4个为一个数据
        //循环一个像素点
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];
        const avg = (r + g + b) / 3;

        imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg;
    }
    return imgData
}