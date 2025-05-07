<template>
  <h3>AudioContext 4 音调与频域</h3>
  <div>
    <button @click="loadAudio">加载资源</button>
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { BufferLoader } from './Bufferloader';
import { getAudioContext } from './ContextClass';

let context: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
const RANDOM_PLAYBACK = 10;
const RANDOM_VOLUME = 1;

const url = new URL(`../assets/Shape Of You.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const bufferList = await BufferLoader(context, [url]);
    buffer = bufferList[0];
  }
}

function makeSource(buffer: AudioBuffer) {
  if (context) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gain = context.createGain();
    source.connect(gain);
    gain.connect(context.destination);
    return source;
  }
  return null
}
function shootRound(numberOfRounds: number, timeBetweenRounds: number) {
  if (context) {
    const { currentTime: time } = context;
    for (let i = 0; i < numberOfRounds; i++) {
      const s = makeSource(buffer!);
      if (s) {
        s.playbackRate.value = 1 + Math.random() * RANDOM_PLAYBACK;
        s.start(time + i * timeBetweenRounds + Math.random() * RANDOM_VOLUME);
      }
    }
  }
}
function play() {
  if (!buffer) {
    console.error('请先点击加载音频 buffer')
    return;
  }
  shootRound(12, 2);
}
</script>
<style lang="scss" scoped>

</style>