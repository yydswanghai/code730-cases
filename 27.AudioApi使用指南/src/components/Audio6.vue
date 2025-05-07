<template>
  <h3>AudioContext 6 滤波器</h3>
  <label for="radio1">
    lowpass
    <input type="radio" id="radio1" value="lowpass" v-model="radio">
  </label>
  <label for="radio2">
    highpass
    <input type="radio" id="radio2" value="highpass" v-model="radio">
  </label>
  <label for="radio3">
    bandpass
    <input type="radio" id="radio3" value="bandpass" v-model="radio">
  </label>
  <label for="radio4">
    lowshelf
    <input type="radio" id="radio4" value="lowshelf" v-model="radio">
  </label>
  <label for="radio5">
    highshelf
    <input type="radio" id="radio5" value="highshelf" v-model="radio">
  </label>
  <label for="radio6">
    peaking
    <input type="radio" id="radio6" value="peaking" v-model="radio">
  </label>
  <label for="radio7">
    notch
    <input type="radio" id="radio7" value="notch" v-model="radio">
  </label>
  <label for="radio8">
    allpass
    <input type="radio" id="radio8" value="allpass" v-model="radio">
  </label>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass';

let context: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let buffer: AudioBuffer | null = null;
const radio = ref<BiquadFilterType>('lowpass');

const url = new URL(`../assets/Shape Of You.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const bufferList = await BufferLoader(context, [url]);
    buffer = bufferList[0];
  }
}

async function play() {
  if (!buffer || !context) {
    console.error('请先点击加载音频 buffer')
    return;
  }
  if (source) {
    source.stop();
  }
  const filterType: BiquadFilterType = radio.value;
  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = 100;// 截止频率（单位：Hz，范围：20-20000）
  const gainNode = context.createGain();
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
}
</script>
<style lang="scss" scoped>

</style>