<template>
    <transition 
    appear
    :name="props.type" :style="`transition-delay : ${Delay}s`">
        <slot v-if="mounted" :key="props.key"/>
    </transition>
</template>
<script setup>
import {onMounted, ref, computed} from 'vue'
const props = defineProps({
    type: String,
    delay :  Number,
    key : String
})

const mounted = ref(false)
const Delay = ref(computed(() => {
    if (props.delay != 0 && !props.delay) {
    return 0
    }
    else {
        return props.delay / 1000
    }
}))


onMounted(() => {
    mounted.value = true
})


</script>
<style scoped>


.fade-up-enter-active{
    transition : all 0.48s ease
}
.fade-up-leave-active{
    transition: all 0.2s ease;
}

.fade-up-leave-from,
.fade-up-enter-to{
    transform: translateY(0%);
    opacity: 1;
}

.fade-up-enter-from,
.fade-up-leave-to{
    transform: translateY(5%);
    opacity: 0;
}

.fade-up-half-enter-active{
    transition : all 0.48s ease
}
.fade-up-half-leave-active{
    transition: all 0.2s ease;
}


.fade-up-half-leave-from,
.fade-up-half-enter-to{
    transform: translateY(0%);
    opacity: 1;
}

.fade-up-half-enter-from,
.fade-up-half-leave-to{
    transform: translateY(2%);
    opacity: 0;
}







.fade-right-enter-active{
    transition : all 0.38s ease
}
.fade-right-leave-active{
    transition: all 0.2s ease;
}

.fade-right-leave-from,
.fade-right-enter-to{
    transform: translateX(0%);
    opacity: 1;
}

.fade-right-enter-from,
.fade-right-leave-to{
    transform: translateX(-5%);
    opacity: 0;
}



.fade-left-enter-active{
    transition : all 0.38s ease
}
.fade-left-leave-active{
    transition: all 0.2s ease;
}

.fade-left-leave-from,
.fade-left-enter-to{
    transform: translateX(0%);
    opacity: 1;
}

.fade-left-enter-from,
.fade-left-leave-to{
    transform: translateX(5%);
    opacity: 0;
}


</style>