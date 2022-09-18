<template>
    <div>
        <p>账号：<input type="text" v-model="loginId" autocomplete="new-password" /></p>
        <p>密码：<input type="password" v-model="loginPwd" autocomplete="new-password" /></p>
        <p><button @click="handleClick">登录</button></p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const loginId = ref('')
const loginPwd = ref('')

async function handleClick() {
    const user = await userStore.login({
        loginId: loginId.value,
        loginPwd: loginPwd.value })
    if(user){
        router.push('/')
    }else{
        alert("账号密码错误");
    }
}
</script>