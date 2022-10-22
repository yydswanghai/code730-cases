<template>
    <div class="home-container">
        <n-button type="primary" @click="$emit('update:modelValue', modelValue+1)">添加</n-button>
        <h2>书籍列表</h2>
        <n-data-table :columns="columns" :data="data" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { getBooks } from '@/api/editor'
import { statusCodeEnum } from '@/enums/statusCodeEnum'

export default defineComponent({
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: Number,
            default: 0,
        },
    },
    setup() {
        const columns = [
            { title: '书籍名称', key: 'name' },
            { title: '作者', key: 'author' },
            { title: '发布时间', key: 'publishDate' },
            { title: '封面图', key: 'imgUrl' },
            { title: '书籍描述', key: 'description' },
        ]
        const data = ref<any[]>([])
            // {
            //     key: 0,
            //     name: '07akioni',
            //     author: '18',
            //     publishDate: 'Yiheyuan Road',
            //     imgUrl: 'Yiheyuan Road',
            //     description: 'Yiheyuan Road',
            // },

        async function fetchDatas() {
            const resp = await getBooks()
            if(resp.code === statusCodeEnum.success){
                data.value = resp.data.datas.map((item: any) => ({
                    key: item.id,
                    name: item.name,
                    author: item.author,
                    publishDate: item.publishDate,
                    imgUrl: item.imgUrl,
                    description: item.description
                }))
            }
        }
        fetchDatas()
        return {
            columns,
            data,
        }
    }
})
</script>