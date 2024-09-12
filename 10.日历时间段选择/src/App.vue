<template>
  <div>
    <button @click="handleChange">今日</button>
    <button @click="handleChange">昨日</button>
    <button @click="handleChange">本月</button>
    <button @click="handleChange">上月</button>
    <br />
    <button @click="handleChange">一季度</button>
    <button @click="handleChange">二季度</button>
    <button @click="handleChange">三季度</button>
    <button @click="handleChange">四季度</button>
    <br />
    <button @click="handleChange">去年</button>
    <button @click="handleChange">今年</button>
    
    <Calendar v-model="dateValues" format="YYYY-MM-DD" />
  </div>
</template>

<script lang="ts" setup>
import Calendar from './Calendar.vue';
import { ref, toRaw, watchEffect } from 'vue';
import dayjs from "dayjs";

const dateValues = ref<string[]>([]);

function handleChange(e: any) {
  const type = e.target.innerText;
  let current = dayjs();
  const f = 'YYYY-MM-DD';
  let arr: string[] = [];
  switch (type) {
    case '今日':
      arr = [current.format(f)];
      break;
    case '昨日':
      arr = [current.subtract(1, 'day').format(f)];
      break;
    case '本月':
      arr = [current.date(1).format(f), current.date(current.daysInMonth()).format(f)];
      break;
    case '上月':
      current = current.subtract(1, 'month');
      arr = [current.date(1).format(f), current.date(current.daysInMonth()).format(f)];
      break;
    case '一季度':
      arr = [
        current.month(0).date(1).format(f),
        current.month(2).date(current.month(2).daysInMonth()).format(f)
      ];
      break;
    case '二季度':
      arr = [
        current.month(3).date(1).format(f),
        current.month(5).date(current.month(5).daysInMonth()).format(f)
      ];
      break;
    case '三季度':
      arr = [
        current.month(6).date(1).format(f),
        current.month(8).date(current.month(8).daysInMonth()).format(f)
      ];
      break;
    case '四季度':
      arr = [
        current.month(9).date(1).format(f),
        current.month(11).date(current.month(11).daysInMonth()).format(f)
      ];
      break;
    case '今年':
      arr = [
        current.month(0).date(1).format(f),
        current.month(11).date(current.month(11).daysInMonth()).format(f)
      ];
      break;
    case '去年':
      current = current.subtract(1, 'year');
      arr = [
        current.month(0).date(1).format(f),
        current.month(11).date(current.month(11).daysInMonth()).format(f)
      ];
      break;
    default:
      arr = [];
      break;
  }
  dateValues.value = arr;
}

watchEffect(() => {
  console.log('change-date: ', toRaw(dateValues.value))
})
</script>
<style lang="scss" scoped>
.calendar {
  width: 360px;
}
</style>