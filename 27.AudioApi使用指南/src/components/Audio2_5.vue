<template>
  <h3>AudioContext 25</h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="play">播放</button>
    <button @click="play2">播放2</button>
  </div>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass';

let context: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let source: AudioBufferSourceNode | null = null;
const DURATION = 2;
const FREQUENCY = 1;
const SCALE = 0.7;


const url = new URL(`../assets/laizitiantangdemogui.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const bufferList = await BufferLoader(context, [url]);
    buffer = bufferList[0];
  }
}
// 自定义振荡曲线
function mannulOscillator() {
  const valueCount = 4096;
  let values = new Float32Array(valueCount);
  for (let i = 0; i < valueCount; i++) {
    let percent = (i / valueCount) * DURATION*FREQUENCY;
    values[i] = 1 + (Math.sin(percent * 2*Math.PI) * SCALE);
    if (i == valueCount - 1) {
      values[i] = 1;
    }
  }
  return values;
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
  source.loop = true;
  const gain = context.createGain();
  const values = mannulOscillator();
  gain.gain.setValueCurveAtTime(values, context.currentTime, DURATION);

  source.connect(gain);
  gain.connect(context.destination);
  source.start(0);
}

function play2() {
  if (!buffer || !context) {
    console.error('请先点击加载音频 buffer')
    return;
  }
  if (source) {
    source.stop();
  }

  source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = context.createGain();
  const osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2, context.currentTime);
  gain.gain.value = SCALE;

  source.connect(gain);
  osc.connect(gain);
  gain.connect(context.destination);
  source.start(0);

  // 震荡立即开始，2s后结束
  osc.start(0);
  osc.stop(context.currentTime + DURATION);
}
</script>
<style lang="scss" scoped>

</style>