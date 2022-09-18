<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/protect">Protect</router-link> |
      <a v-if="isLoading">Loading...</a>
      <template v-else-if="userdata">
        <span>{{ userdata }}</span>
        <button @click="loginOut">注销</button>
      </template>
      <router-link v-else to="/login">Login</router-link>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/request'

http().request({
  method: 'get',
  url: '/api/student'
})

const router = useRouter();
const userStore = useUserStore();
const isLoading = computed(() => userStore.isLoading)
const userdata = computed(() => userStore.data)


const loginOut = () => {
  userStore.loginOut()
  router.push('/login')
}

</script>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
