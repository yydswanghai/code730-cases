<template>
  <h3>AudioContext 52 频域/时域图</h3>
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

      const freqDomain = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqDomain);
      cvsCtx!.clearRect(0, 0, WIDTH, HEIGHT);
      // 频域图
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
      analyser.getByteTimeDomainData(timeDomain);
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