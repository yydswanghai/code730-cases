<template>
  <h3>AudioContext 56 文件音量图</h3>
  <div>选择一个 mp3 显示整个声音文件的音量图</div>
  <label for="radio1">
    固定
    <input type="radio" id="radio1" :value="1" v-model="radio">
  </label>
  <label for="radio2">
    渐变
    <input type="radio" id="radio2" :value="2" v-model="radio">
  </label>
  <div>
    <input type="file" id="audiofile" accept=".mp3" @change="upload" />
  </div>
  <canvas width="768" height="200" ref="canvas"></canvas>
</template>

<script lang="ts" setup>
import { getAudioContext } from './ContextClass';
import { ref } from 'vue'

let context: AudioContext | null = null;
const canvas = ref<HTMLCanvasElement | null>(null);
const radio = ref(0);

function upload(e: any) {
  const file = (e.target.files as FileList)[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const result = event.target?.result; // 文件内容
    context = getAudioContext();
    if (context && result) {
      context.decodeAudioData(result as ArrayBuffer, (buffer) => {
        // 获取音频缓冲区数据
        const channelData = buffer.getChannelData(0);
        // 绘制
        if (radio.value === 2) {
          draw2(channelData);
        } else {
          draw(channelData);
        }
      })
    }
  }
  reader.onerror = (error) => {
    console.error('读取失败:', error);
  }
  reader.readAsArrayBuffer(file);
}
function draw(data: Float32Array<ArrayBufferLike>) {
  const cvs = canvas.value;
  if (!cvs) return;
  const cvsCtx = cvs.getContext('2d');
  if (!cvsCtx) return;
  const WIDTH = cvs.width;
  const HEIGHT = cvs.height;

  const step = Math.ceil(data.length / WIDTH); // 计算每个画布像素对应的音频样本数
  const amp = HEIGHT / 2; // 放大因子，用于控制波形在画布上的高度

  cvsCtx!.clearRect(0, 0, WIDTH, HEIGHT);// 清除之前的
  cvsCtx!.fillStyle = "#fff"; // 设置填充颜色为白色
  cvsCtx!.fillRect(0, 0, WIDTH, HEIGHT); // 填充整个画布为白色
  cvsCtx!.beginPath(); // 开始绘制新的路径
  cvsCtx!.moveTo(0, amp); // 将绘图游标移动到画布中央的起始点

  console.log(data);
  // 绘制波形
  for (let i = 0; i < WIDTH; i += 4) {
    // 遍历画布的每一个像素
    let min = 1.0; // 初始化最小值
    let max = -1.0; // 初始化最大值
    for (let j = 0; j < step; j++) {
      // 遍历与当前像素对应的音频样本

      const datum = data[i * step + j]; // 获取单个音频样本
      if (datum < min) min = datum; // 更新最小值
      if (datum > max) max = datum; // 更新最大值
    }
    cvsCtx!.lineTo(i, (1 + min) * amp); // 绘制从当前位置到最小值的线
    cvsCtx!.lineTo(i, (1 + max) * amp); // 绘制从当前位置到最大值的线
  }
  cvsCtx!.stroke(); // 根据路径绘制线条
}

function draw2(data: Float32Array<ArrayBufferLike>) {
  const cvs = canvas.value;
  if (!cvs) return;
  const cvsCtx = cvs.getContext('2d');
  if (!cvsCtx) return;
  const WIDTH = cvs.width;
  const HEIGHT = cvs.height;

  const step = Math.ceil(data.length / WIDTH); // 计算每个画布像素对应的音频样本数
  const amp = HEIGHT / 2; // 放大因子，用于控制波形在画布上的高度

  cvsCtx!.fillStyle = "#fff"; // 设置填充颜色为白色
  cvsCtx!.fillRect(0, 0, WIDTH, HEIGHT); // 填充整个画布为白色
  cvsCtx!.beginPath(); // 开始绘制新的路径
  cvsCtx!.moveTo(0, amp); // 将绘图游标移动到画布中央的起始点

  console.log(data);
  // 绘制波形
  for (let i = 0; i < WIDTH; i += 4) {
    // 遍历画布的每一个像素
    let min = 1.0; // 初始化最小值
    let max = -1.0; // 初始化最大值
    for (let j = 0; j < step; j++) {
      // 遍历与当前像素对应的音频样本

      const datum = data[i * step + j]; // 获取单个音频样本
      if (datum < min) min = datum; // 更新最小值
      if (datum > max) max = datum; // 更新最大值
    }
    const hue = (i / WIDTH) * 360;
    cvsCtx!.beginPath()
    cvsCtx!.strokeStyle = "hsl(" + hue + ", 100%, 50%)";
    cvsCtx!.moveTo(i, amp);
    cvsCtx!.lineTo(i, (1 + min) * amp); // 绘制从当前位置到最小值的线
    cvsCtx!.stroke(); // 根据路径绘制线条

    cvsCtx!.beginPath()
    cvsCtx!.moveTo(i, amp);
    cvsCtx!.lineTo(i, (1 + max) * amp); // 绘制从当前位置到最大值的线
    cvsCtx!.stroke(); // 根据路径绘制线条
  }
}
</script>
<style lang="scss" scoped>

</style>