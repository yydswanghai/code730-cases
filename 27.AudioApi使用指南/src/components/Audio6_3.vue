<template>
  <h3>AudioContext 6_3 </h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader'
import { getAudioContext } from './ContextClass'

let context: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let buffer: AudioBuffer | null = null;
let impulseResponseBuffer: AudioBuffer | null = null;

const url = new URL(`../assets/test1.mp3`, import.meta.url).href;
const url2 = new URL(`../assets/impulse.wav`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const ImpBufferList = await BufferLoader(context, [url2]);
    impulseResponseBuffer = ImpBufferList[0];
    const bufferList = await BufferLoader(context, [url]);
    buffer = bufferList[0];
  }
}

function play() {
  if (!buffer || !context) {
    console.error('请先点击加载音频 buffer')
    return;
  }
  if (source) {
    source.stop();
  }
  source = context.createBufferSource();
  source.buffer = buffer;
  const convolver = context.createConvolver();
  convolver.buffer = impulseResponseBuffer;
  source.connect(convolver);
  convolver.connect(context.destination);
  source.start(0);
}
</script>
<style lang="scss" scoped>

</style>