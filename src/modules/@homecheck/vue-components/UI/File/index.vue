<template>
    <div>
    <input ref="fileElement" type="file" accept="image/*" capture="environment" 
    @change="onChanged"/>
    <div v-wave class="file-btn" @click="openFile">{{  props.label }}</div>
    </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import { CacheStorageAPI, CacheImage } from '../../../libs/CacheStorage'
import { getRandomString } from '../../../libs/Functions'


const props = defineProps({
    label : String
})

const emits = defineEmits(['onChanged'])

const fileElement = ref<HTMLInputElement>(null);

function openFile(){
    fileElement.value.click();
}


function onChanged(e){
    if(!e.target.files[0]) return;
    emits("onChanged", e.target.files[0])
}

</script>
<style scoped>
input[type="file"]{
    display: none;
}

.file-btn {
    padding : 0.4rem 0.6rem;
    border-radius: 0.4rem;
    font-weight: 500;
    font-size: 0.8rem;
    background-color : #eaeaea;
    text-align: center;
}

</style>
