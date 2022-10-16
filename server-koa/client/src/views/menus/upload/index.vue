<template>
    <div class="upload-container">
        <Single fileListJustifyContent="center" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Single from './components/single.vue'
export default defineComponent({
    components: {
        Single
    },
    setup(){

        return {

        }
    }
})
</script>
<style lang="scss" scoped>
.upload-container{
    width: 100%;
    height: calc(100vh - 108px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
}
</style>