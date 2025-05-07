<template>
  <h3>AudioContext 1</h3>
  <div>
    <button @click="handleRequest">加载资源</button>
    <button @click="playSound">播放</button>
  </div>
  <button @click="loadAndPlay">加载并播放</button>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader'
import { getAudioContext } from './ContextClass'

/**
 * AudioContext.destination 是一个特殊的节点，一般为系统的默认音频输出
 */
const url1 = new URL(`../assets/Shape Of You.mp3`, import.meta.url).href;
const url2 = new URL(`../assets/laizitiantangdemogui.mp3`, import.meta.url).href;
// 1：使用xhr加载一段音频文件
let buffer: AudioBuffer | null = null;
function handleRequest() {
  const context = getAudioContext();
  if (!context) return;
  const request = new XMLHttpRequest();
  request.open('GET', url2, true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    // 解码音频数据
    context.decodeAudioData(request.response)
      .then((_buffer) => {
        buffer = _buffer;
        console.log('音频解码成功');
      })
      .catch(error => {
        console.error('音频解码失败:', error);
      })
  };
  request.onerror = function () {
    console.error('加载音频文件失败');
  };
  request.send();
}
// 2：播放音频
function playSound() {
  const context = getAudioContext();
  if (!context) return;
  if (buffer) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  }
}

// 加载并播放音频
function loadAndPlay() {
  const context = getAudioContext();
  if (!context) return;
  BufferLoader(context, [
    url1, url2
  ])
  .then(bufferList => {
    console.log(bufferList)
    let source1 = context.createBufferSource(); // 创建源节点
    let source2 = context.createBufferSource(); // 创建源节点
    source1.buffer = bufferList[0];
    source2.buffer = bufferList[1];
    source1.connect(context.destination);
    source2.connect(context.destination);
    source1.start(0);
    source2.start(0);
  })
}
</script>
<style lang="scss" scoped>

</style>