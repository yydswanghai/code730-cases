<script setup lang="ts">
import { ref } from 'vue';
import Audio1 from './components/Audio1.vue'
import Audio2 from './components/Audio2.vue'
import Audio2_2 from './components/Audio2_2.vue'
import Audio2_3 from './components/Audio2_3.vue'
import Audio2_4 from './components/Audio2_4.vue'
import Audio2_5 from './components/Audio2_5.vue'
import Audio4 from './components/Audio4.vue'
import Audio5 from './components/Audio5.vue'
import Audio5_2 from './components/Audio5_2.vue'
import Audio5_3 from './components/Audio5_3.vue'
import Audio5_4 from './components/Audio5_4.vue'
import Audio5_5 from './components/Audio5_5.vue'
import Audio5_6 from './components/Audio5_6.vue'
import Audio6 from './components/Audio6.vue'
import Audio6_2 from './components/Audio6_2.vue'
import Audio6_3 from './components/Audio6_3.vue'

const current = ref('');
const array = ['1', '2', '2_2', '2_3', '2_4', '2_5', '4', '5', '5_2', '5_3', '5_4', '5_5', '5_6', '6', '6_2', '6_3']
function handleClick(key: string) {
  current.value = key
}

</script>

<template>
  <div class="home">
    详情请参考：https://juejin.cn/post/7346113400646762535
    <div class="btns">
      <button v-for="it in array" @click="handleClick(it)">{{ it }}</button>
    </div>
    <Audio1 v-if="current === '1'" />
    <Audio2 v-else-if="current === '2'" />
    <Audio2_2 v-else-if="current === '2_2'" />
    <Audio2_3 v-else-if="current === '2_3'" />
    <Audio2_4 v-else-if="current === '2_4'" />
    <Audio2_5 v-else-if="current === '2_5'" />
    <Audio4 v-else-if="current === '4'" />
    <Audio5 v-else-if="current === '5'" />
    <Audio5_2 v-else-if="current === '5_2'" />
    <Audio5_3 v-else-if="current === '5_3'" />
    <Audio5_4 v-else-if="current === '5_4'" />
    <Audio5_5 v-else-if="current === '5_5'" />
    <Audio5_6 v-else-if="current === '5_6'"/>
    <Audio6 v-else-if="current === '6'"/>
    <Audio6_2 v-else-if="current === '6_2'"/>
    <Audio6_3 v-else-if="current === '6_3'"/>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
