<template>
    <div class="upload-index">
        <Single />
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
    
}
</style>