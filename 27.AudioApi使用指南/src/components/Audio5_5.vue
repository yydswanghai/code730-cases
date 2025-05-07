<template>
  <h3>AudioContext 55 频域图</h3>
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

      let volume = 0;
      for (let i = 0; i < bufferLength; i++) {
        volume += dataArray[i];
      }
      volume /= bufferLength;

      cvsCtx!.beginPath();
      cvsCtx!.arc(100, 100, volume + 50, 0, 2 * Math.PI);
      cvsCtx!.strokeStyle = 'pink';
      cvsCtx!.fillStyle = 'yellowgreen'
      cvsCtx!.lineWidth = 3;
      cvsCtx!.stroke();
      cvsCtx!.fill()

      console.log(`Volume: ${volume}`);
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