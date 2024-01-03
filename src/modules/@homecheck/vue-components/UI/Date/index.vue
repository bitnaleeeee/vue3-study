<template>
 <span> {{`${modelValue.getFullYear()}.${addZero((modelValue.getMonth() + 1) )}.${addZero(modelValue.getDate())}`}}</span>
</template>
<script>

export default {
props: ["modelValue"],
    methods :{
            addZero(i){
        return i < 10 ? '0' + i : i
        },
    }
}
</script>