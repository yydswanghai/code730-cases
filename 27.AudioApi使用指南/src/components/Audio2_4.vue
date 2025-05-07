<template>
  <h3>AudioContext 24</h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass';

let context: AudioContext | null = null;
let buffers: AudioBuffer[] = [];
let iterations = 2;
let fadeTime = 8;

const url = new URL(`../assets/laizitiantangdemogui.mp3`, import.meta.url).href;
const url2 = new URL(`../assets/Shape Of You.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const bufferList = await BufferLoader(context, [url, url2]);
    buffers = bufferList;
  }
}

function createSource(buffer: AudioBuffer) {
  if (!buffer.length) {
    console.error('请先点击加载音频 buffer')
  }
  if (context) {
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    return {
      source,
      gainNode
    }
  }
  return null
}

function play() {
  if (!buffers.length || !context) {
    console.error('请先点击加载音频 buffer')
    return;
  }

  let { currentTime } = context;
  for (let i = 0; i < iterations; i++) {
    for (let j = 0; j < buffers.length; j++) {
      const buffer = buffers[j];
      const duration = buffer.duration;// 音频总时长
      const info = createSource(buffer);
      if (info) {
        const { source, gainNode } = info;
        // 播放开始时，渐入 增益从0～1 (渐入时间为 fadeTime)
        gainNode.gain.linearRampToValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(1, currentTime + fadeTime);
        // 播放结束时，渐出 增益从1～1
        gainNode.gain.linearRampToValueAtTime(1, currentTime + duration - fadeTime);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
        // 播放当前音频
        source.start(currentTime);
        // 为下次迭代累加时间
        currentTime += duration - fadeTime;
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>