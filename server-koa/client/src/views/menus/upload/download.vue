<template>
    <div class="download-container">
        <n-button type="primary" @click="handleDownload">下载文件</n-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { getAllFiles, download } from '@/api/upload'
export default defineComponent({
    setup(){
        async function fetchAllFiles() {
            const res = await getAllFiles();
            console.log(res)
        }
        fetchAllFiles()

        async function handleDownload() {
            const res = await download('1666146326732-9nktfo.jpeg')
            console.log(res)
        }

        return {
            handleDownload
        }
    }
})
</script>
<style lang="scss" scoped>
    
</style>