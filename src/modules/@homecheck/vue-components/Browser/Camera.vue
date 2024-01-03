<template>
    <div class="browser-camera">
        <UIButton  :for="id"
        type="black circle" size="sm">
        <slot/></UIButton>
        <input 
        :id="id"
        type="file" 
        accept="image/*"
        capture="environment" @change="fileChange"/>
    </div>
</template>
<script setup lang="ts">
import { getRandomString} from '@/modules/@homecheck/libs'

const emit = defineEmits(['onFileAdded'])
const id = `browser-camera-${getRandomString(8,false)}`

function fileChange(e) {
    if (!e.target.files[0]) return;

    emit("onFileAdded", e.target.files[0])
}


</script>
<style scoped >
.browser-camera {
}

.browser-camera input {
    display: none;
}

</style>