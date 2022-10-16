<template>
    <div class="upload-index">
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
.upload-index{
    width: 100%;
    padding: 100px 0 0;
}
</style>