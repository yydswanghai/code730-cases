<template>
  <h3>AudioContext 6_2 利用程序创建的不同枪声效果</h3>
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
    <button @click="play">播放</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getAudioContext } from './ContextClass';

let context: AudioContext | null = null;
const radio = ref<BiquadFilterType>('lowpass');

// function WhiteNoiseScript() {
//   this.node = context?.createScriptProcessor(1024, 1, 2);
//   this.node.onaudioprocess = this.process;
// }

// WhiteNoiseScript.prototype.process = function (e) {
//   const L = e.outputBuffer.getChannelData(0);
//   const R = e.outputBuffer.getChannelData(1);
//   for (let i = 0; i < L.length; i++) {
//     L[i] = ((Math.random() * 2) - 1);
//     R[i] = L[i];
//   }
// }

class WhiteNoiseGenerated {
  context: AudioContext;
  node: AudioBufferSourceNode;
  constructor(context: AudioContext) {
    this.context = context;
    // Generate a 5 second white noise buffer.
    var lengthInSamples = 5 * context.sampleRate;
    var buffer = context.createBuffer(1, lengthInSamples, context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < lengthInSamples; i++) {
      data[i] = ((Math.random() * 2) - 1);
    }
    // Create a source node from the buffer.
    this.node = context.createBufferSource();
    this.node.buffer = buffer;
    this.node.loop = true;
    this.node.start(0);
  }
}

class Envelope {
  context: AudioContext;
  node: GainNode;
  addEventToQueue() {
    this.node.gain.linearRampToValueAtTime(0, this.context.currentTime);
    this.node.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.001);
    this.node.gain.linearRampToValueAtTime(0.3, this.context.currentTime + 0.101);
    this.node.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.500);
  };
  constructor(context: AudioContext) {
    this.context = context;
    this.node = context.createGain();
    this.node.gain.value = 0;
  }
}

function play() {
  const filterType: BiquadFilterType = radio.value;
  context = getAudioContext();
  if (!context) return;
  const noise = new WhiteNoiseGenerated(context);
  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.Q.value = 1;
  filter.frequency.value = 800;
  // Initialize multiple voices.
  for (var i = 0; i < 5; i++) {
    const voice = new Envelope(context);
    noise.node.connect(voice.node);
    voice.node.connect(filter);
    voice.addEventToQueue();
  }
  const gainMaster = context.createGain();
  gainMaster.gain.value = 5;
  filter.connect(gainMaster);
  gainMaster.connect(context.destination);
}
</script>
<style lang="scss" scoped>

</style>