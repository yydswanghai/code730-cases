<template>
    <div class="qrcode-container">
        <n-auto-complete v-model:value="value" :options="options">
            <template #default="{ handleInput, handleBlur, handleFocus, value: inputValue }" >
                <n-input
                    type="textarea"
                    :value="inputValue"
                    placeholder="邮箱"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                />
            </template>
        </n-auto-complete>
        <n-button @click="confirm">确认</n-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { getQrcode } from '@/api/qrcode'

export default defineComponent({
    setup(){
        const value = ref('');
        const options = computed(() => {
            const arr = ['.com', '@gmail.com', '@163.com', '@qq.com'];
            return arr.map(suffix => {
                const prefix = value.value.split('@')[0]
                return {
                    label: prefix + suffix,
                    value: prefix + suffix
                }
            })
        });
        async function confirm() {
            const resp = await getQrcode({ str: value.value })
        }
        return {
            value,
            options,
            confirm
        }
    }
})
</script>
<style lang="scss" scoped>
    
</style>