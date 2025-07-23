<template>
    <div class="tags">
        <el-tag
            v-for="(tag,index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :effect="tag.name === route.name ? 'dark' : 'plain'" 
            @click="handleMenu(tag)"
            @close="handleClose(tag,index)"
        >
        {{ tag.label }}
        </el-tag>

    </div>

</template>

<script setup>
import { ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { useAllDataStore } from '@/stores';
const store = useAllDataStore();

const tags = computed(() => store.state.tags);

const route = useRoute();
const router = useRouter();

const handleMenu = (tag) => {
    router.push(tag.path);
    store.selectMenu(tag);
}

const handleClose = (tag,index) => {
    //通过pinia管理的
    store.updateTags(tag);
    if(tag.name !== route.name) return;
    if(index === store.state.tags.length){
        store.selectMenu(store.state.tags[index-1]);
        router.push(tags.value[index-1].path);
    }else{
        store.selectMenu(store.state.tags[index]);
        router.push(store.state.tags[index].path);
    }
}


</script>

<style scoped lang="less">
.tags{
    margin: 20px 0 0 20px;
}
.el-tag{
    margin-right: 10px;
}

</style>