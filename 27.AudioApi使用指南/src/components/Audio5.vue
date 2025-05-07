<template>
  <h3>AudioContext 5 频域/时域图</h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="play">播放并显示音频图</button>
  </div>
  <canvas width="768" height="200" ref="canvas"></canvas>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass';
import { onUnmounted, ref } from 'vue'

let context: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let requestId: number = 0;
let source: AudioBufferSourceNode | null = null;
const canvas = ref<HTMLCanvasElement | null>(null);

const url = new URL(`../assets/Shape Of You.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (!context) return;
  const bufferList = await BufferLoader(context, [url]);
  buffer = bufferList[0];
}

function play() {
  if (!buffer || !context) {
    cancelAnimationFrame(requestId);
    console.error('请先点击加载音频 buffer');
    return;
  }
  // 停止之前的播放
  if (source) {
    source.stop();
  }
  source = context.createBufferSource();
  source.buffer = buffer;

  const analyser = context.createAnalyser();
  analyser.fftSize = 512; // fftSize：定义缓冲区大小，大小一定是2的幂

  source.connect(analyser);
  analyser.connect(context.destination);
  source.start(0);

  const cvs = canvas.value;
  if (!cvs) return;
  const cvsCtx = cvs.getContext('2d');
  if (!cvsCtx) return;
  const WIDTH = cvs.width;
  const HEIGHT = cvs.height;

  function draw() {
    requestId = requestAnimationFrame(draw);

    // 频域图
    const freqDomain = new Uint8Array(analyser.frequencyBinCount);// frequencyBinCount: 只读属性，自动为 fftSize / 2。
    analyser.getByteFrequencyData(freqDomain);// 得到频域的数组
    cvsCtx!.clearRect(0, 0, WIDTH, HEIGHT);
    const barWidth = (WIDTH / analyser.frequencyBinCount) * 2.5; // 柱状条宽
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      const value = freqDomain[i];
      const percent = value / 256;
      const barHeight = HEIGHT * percent;// 柱状条高
      const x = i * barWidth;
      const y = HEIGHT - (HEIGHT * percent) - 1;
      const hue = (i / analyser.frequencyBinCount) * 360; // 频谱色渐变

      cvsCtx!.fillStyle = `hsl(${hue}, 100%, 80%)`;// hsl：参数一：色相(0~360的数值) 参数二：饱和度(单位百分比) 参数三：亮度(单位百分比)
      cvsCtx!.fillRect(x, y, barWidth - 1, barHeight);
    }

    // 时域图
    const timeDomain = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(timeDomain);// 得到时域的数组
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      const value = timeDomain[i];
      const percent = value / 256;
      const x = i * (WIDTH / analyser.frequencyBinCount);
      const y = HEIGHT - (HEIGHT * percent) - 1;

      cvsCtx!.fillStyle = "block";
      cvsCtx!.fillRect(x, y, 1, 1);
    }
  }

  draw();
}
onUnmounted(() => {
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  if (source) {
    source.stop();
  }
})
</script>
<style lang="scss" scoped>

</style>