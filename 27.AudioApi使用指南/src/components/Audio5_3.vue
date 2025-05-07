<template>
  <h3>AudioContext 53 频域图</h3>
  <div>
    <button @click="play">开始说话并显示音频图</button>
  </div>
  <canvas width="768" height="200" ref="canvas"></canvas>
</template>

<script lang="ts" setup>
import { getAudioContext } from './ContextClass';
import { onUnmounted, ref } from 'vue'

let context: AudioContext | null = null;
let requestId: number = 0;
let mediaStream: MediaStream | null = null;
const canvas = ref<HTMLCanvasElement | null>(null);

async function play() {
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
    cancelAnimationFrame(requestId);
    return;
  }
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    context = getAudioContext();
    if (!context) return;

    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    console.log(analyser)
    const source = context.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    const cvs = canvas.value;
    if (!cvs) return;
    const cvsCtx = cvs.getContext('2d');
    if (!cvsCtx) return;
    const WIDTH = cvs.width;
    const HEIGHT = cvs.height;

    function draw() {
      requestId = requestAnimationFrame(draw);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      cvsCtx!.clearRect(0, 0, WIDTH, HEIGHT);
      cvsCtx!.fillStyle = 'rgb(200, 200, 200)';
      cvsCtx!.fillRect(0, 0, WIDTH, HEIGHT);
      cvsCtx!.lineWidth = 10;
      cvsCtx!.beginPath();// 开始绘制新的路径
      // 1-start 固定颜色
      // cvsCtx!.fillStyle = 'rgb(0, 255, 0)';
      // 1-end
      // len表示获取分析到的音频数据数组长度的
      // 这里除以2.5是剔除不经常出现的高频的部分
      const len = dataArray.length / 2.5
      // barWidth表示每个波形矩形的宽度
      // 这里除以2是为了绘制对称的波形图
      const barWidth = (WIDTH / len) / 2
      // console.log(dataArray);
      for (let i = 0; i < len; i++) {
        // data是8位数组的每个数据，因为是一个字节，即data的值都是 <= 255
        const data = dataArray[i];
        // barHeight表示每个波形矩形的高度，值为单位长度乘canvas容器的高
        const barHeight = (data / 255) * HEIGHT
        // 绘制点y
        const y = HEIGHT - barHeight
        // 绘制点x1
        const x1 = i * barWidth + WIDTH / 2
        // 绘制点x2
        const x2 = WIDTH / 2 - (i + 1) * barWidth
        // 2-start 频谱色渐变
        const hue = (i / bufferLength) * 360;
        cvsCtx!.fillStyle = `hsl(${hue}, 100%, 80%)`;
        // 2-end
        // 绘制右半部分波形图
        cvsCtx!.fillRect(x1, y, barWidth - 2, barHeight)
        // 绘制左半部分波形图
        cvsCtx!.fillRect(x2, y, barWidth - 2, barHeight)
      }
      cvsCtx!.fill();
    }

    draw();
  } catch (error) {
    console.error("无法获取麦克风");
  }
}
onUnmounted(() => {
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
})
</script>
<style lang="scss" scoped>

</style>