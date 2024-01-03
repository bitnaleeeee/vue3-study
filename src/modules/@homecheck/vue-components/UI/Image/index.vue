<template>
<img :src="props.src" @error="replaceByDefault"/>
</template>
<script setup>
const props = defineProps({
    src : String
})

function replaceByDefault(e){
    console.log(e)
    //e.target.src = img
}

</script>