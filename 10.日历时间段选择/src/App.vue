<template>
  <div>
    <Calendar v-model="dateValues" format="YYYY-MM-DD" />
  </div>
</template>

<script lang="ts" setup>
import Calendar from './Calendar.vue';
import { ref, watchEffect } from 'vue';

const dateValues = ref(['2024-06-28', '2024-07-10']);
watchEffect(() => {
  console.log(dateValues.value);
});
</script>
<style lang="scss" scoped>
</style>