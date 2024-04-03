<script setup lang="ts">
import { login, reqProtected, refreshToken } from './api';

function handleLogin() {
  login().then((res: any) => {
    console.log(res.msg);
  });
}
function handleProtected() {
  reqProtected().then((res: any) => {
    if (res.code === 0) {
      console.log(res.data)
    } else {
      console.log(res.msg)
    } 
  });
}
function handleRefresh() {
  refreshToken().then((res: any) => {
    console.log(res.msg)
  });
}
</script>

<template>
  <div>
    <button @click="handleLogin">登陆</button>
    <button @click="handleProtected">受到保护的接口</button>
    <button @click="handleRefresh">手动刷新token</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
