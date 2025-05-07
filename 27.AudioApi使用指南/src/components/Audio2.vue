<template>
  <h3>AudioContext 2 时间</h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="pause">暂停</button>
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass'

let context: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let startOffset = 0;
let startTime = 0;
let buffer: AudioBuffer | null = null;

const url = new URL(`../assets/laizitiantangdemogui.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const bufferList = await BufferLoader(context, [url])
    buffer = bufferList[0];
    console.log('音频总时长：', buffer!.duration)
  }
}
// 测试，发现 currentTime 会一直递增，即使超过了音频的总时长
// let timer;
// clearInterval(timer);
// timer = setInterval(() => {
//   console.log(context?.currentTime)
// }, 3000);

function pause() {
  source?.stop();
  if (context) {
    startOffset += context.currentTime - startTime;
  }
}
// currentTime 从音频上下文创建开始计算的，以秒为单位，是一个不断递增的值
// 即使音频上下文处于暂停状态（state 为 suspended），currentTime 仍然会继续递增。
// currentTime 的值与音频是否正在播放无关，它只表示音频上下文的当前时间。
// start() 开始播放，确保限定在 buffer 缓冲区的范围内
//  when：开始播放的时间（相对于AudioContext的当前时间）
//  offset：从音频缓冲区的哪个位置开始播放
//  duration：播放持续的时间，之后停止
// 例如，source.start(context.currentTime + 1, 0.5, 2) 表示在1秒后开始播放，从缓冲区的0.5秒处开始，持续播放2秒后停止。
// 还需要注意，多次调用start()会报错，因为每个AudioBufferSourceNode只能启动一次。为了重播底层的缓冲区，你需要新建一个新的源节点
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
  source.connect(context.destination);
  console.log('startTime: ', startTime)

  source.start(0, startOffset % buffer!.duration);
}
// 例如：音频总时长 10s
// 在 currentTime = 1时播放，startTime = 1，(startOffset % buffer.duration = 0，音频的0s位置)
//  播放3s后暂停，此时 currentTime = 4，startOffset = 0 + 4 - 1 = 3；
// 在 currentTime = 6时播放, startTime = 6，(startOffset % buffer.duration = 3，音频的3s位置)
//  播放2s后暂停，此时 currentTime = 8，startOffset = 3 + 8 - 6 = 5；
// 下一次播放从 音频的5s位置
</script>
<style lang="scss" scoped>

</style>