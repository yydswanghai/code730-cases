<template>
  <h3>AudioContext 23</h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="pause">暂停</button>
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass';

let context: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let startOffset = 0;
let startTime = 0;
let buffer: AudioBuffer | null = null;

const url = new URL(`../assets/laizitiantangdemogui.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
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
  startTime = context.currentTime;
  source.buffer = buffer;
  source.loop = true;
  // 创建gain node
  let gainNode = context.createGain();
  source.connect(gainNode);// source 连接 gain node
  gainNode.connect(context.destination);// gain node 连接 destination
  gainNode.gain.setValueAtTime(0.5, context.currentTime + 5);// 5s 后音量减半
  source.start(0, startOffset % buffer!.duration);
}

function pause() {
  if (context) {
    source?.stop();
    startOffset += context.currentTime - startTime;
  }
}
</script>
<style lang="scss" scoped>

</style>