<template>
  <h3>AudioContext 22</h3>
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
let sources: AudioBufferSourceNode[] = [];
let startOffset = 0;
let startTime = 0;
let kick: AudioBuffer | undefined, snare: AudioBuffer | undefined, hihat: AudioBuffer | undefined;

const url = new URL(`../assets/hihat.mp3`, import.meta.url).href;
const url2 = new URL(`../assets/kick.mp3`, import.meta.url).href;
const url3 = new URL(`../assets/snare.mp3`, import.meta.url).href;

async function loadAudio() {
  context = getAudioContext();
  if (context) {
    const bufferList = await BufferLoader(context, [url, url2, url3]);
    const [_hihat, _kick, _snare] = bufferList;
    hihat = _hihat;
    kick = _kick;
    snare = _snare;
  }
}

function playSound(buffer: AudioBuffer, time: number) {
  console.log(time)
  if (!buffer || !context) {
    console.error('请先点击加载音频 buffer')
    return;
  }

  source = context.createBufferSource();
  startTime = context.currentTime;
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}

function play() {
  const eightNoteTime = .5;
  // 具体音乐原理不重要，重要的是反应出可对音频延时播放
  for (let bar = 0; bar < 2; bar++) {
    const time = startTime + bar * 8 * eightNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    playSound(kick!, time);
    playSound(kick!, time + 4 * eightNoteTime);
    // Play the snare drum on beats 3, 7
    playSound(snare!, time + 2 * eightNoteTime);
    playSound(snare!, time + 6 * eightNoteTime);
    // Play the hihat every eighth note.
    for (let i = 0; i < 8; i++) {
      playSound(hihat!, time + i * eightNoteTime);
    }
  }
}

function pause() {
  if (context) {
    sources.forEach(source => {
      source.stop();
    })
    startOffset += context.currentTime - startTime;
  }
}
</script>
<style lang="scss" scoped>

</style>