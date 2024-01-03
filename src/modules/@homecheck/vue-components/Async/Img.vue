<template>
    <!-- @error="onError"-->
    <img ref="imgElement" :src="imgSource" @onError="onError"/>
</template>
<script setup lang="ts">
import {ref, watch, onBeforeMount, onBeforeUnmount} from 'vue'
import { CacheImage } from '@/modules/@homecheck/libs/CacheStorage'
import defaultImg from '@/modules/@homecheck/assets/noimage1.png'
import loadingImg from '@/modules/@homecheck/assets/loading.gif'

const emits=defineEmits(['error'])
const imgElement = ref<HTMLImageElement>(null)
const props = defineProps({
    source : [Promise<String> , String]
})

const imgSource = ref<string>(loadingImg)

onBeforeMount(async ()=>{

    await imageChange(props.source);
})

onBeforeUnmount(() => {
   release()
})

watch(()=> props.source, async (to,from)=>{
    await imageChange(to)
})
function release() {
        try {
        CacheImage.release(imgSource.value)
    }
    catch (ex) {
        
    }
}

function onError(){
    imgSource.value = defaultImg
  emits('error', imgElement)
}

async function imageChange(target : Promise<string> | string){
   release()

    // Promise 타입인지 확인
    let source = ""
    if(target instanceof Promise){
        source =  await target
    }
    else if (typeof target == 'string'){
        source = target
    }

    
    imgSource.value = source
    if(!source){
        onError()
    }


}

defineExpose({
    imgElement
})

</script>
<style scoped>
img {
    width: 100%;
}
</style>