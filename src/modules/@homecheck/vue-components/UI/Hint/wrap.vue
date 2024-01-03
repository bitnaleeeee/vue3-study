<template>
    <div  class="hint-area" :class="[uniqueClass]" >
        <slot />
        <transition name="hint">
            <!-- :style="`transform : translateX( -${PositionX ? PositionX : null}px);`-->
            <div v-if="(props.modelValue)" ref="Hint" :style="`transform : translateX( -${PositionX ? PositionX : null}px);` " 
            class="hint-content">
            <slot name="content"/>
           
            </div>
        </transition>
    </div>
</template>
<script setup>
import { onClickOutside } from '@vueuse/core'
import _ from 'lodash';

const props = defineProps({ modelValue : Boolean })
const Hint = ref(null)
const PositionX = ref(null)

const emit = defineEmits(['update:modelValue'])
const resizeEvent =  _.debounce(moveElement,100)

window.addEventListener("resize", resizeEvent);
onUnmounted(()=>{
    window.removeEventListener("resize", resizeEvent)
})

onClickOutside(Hint, (event) => {
    emit("update:modelValue", false)
})


function moveElement(){
    if(!Hint.value)
    {
        return;
    }
    let element = Hint.value.getBoundingClientRect()
        let width = element.width
        let x = element.x
        if((width + x + 20) > document.body.clientWidth)
        {
            //console.log('element : ',element)
            //console.log('hint :',(width + x + 20))
            //console.log('vw',document.body.clientWidth)
            PositionX.value = `${(width + x + 25) - document.body.clientWidth}`.split('.')[0]
        }
}

watch(()=> Hint.value,(to,from) =>{
    //if(to)
    //{
        moveElement();
    //}
})

</script>
<style scoped>

.bx {
    font-size: 0.5rem;
    color: var(--font-icon);
    vertical-align: middle;
    align-self:center;
}

.bx-border-circle {
    padding: .2em;
    border: .07em solid var(--font-icon)
}
.hint-area{
    position: relative;
    z-index : 999;
}
.hint-content {
    position: absolute;
    z-index:999;
    user-select: none;
    box-sizing : border-box;
    font-size: 14px;
    font-weight: 400;
    min-width:200px;
    max-width:400px;
    line-height: 1.6;
    background: var(--background-content);
    border-radius: var(--radius);
    border : 1px solid var(--border);
    padding : 12px 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    top: 100%;
}

.hint-enter-active,
.hint-leave-active{
    transition: opacity 0.22s ease, top 0.22s ease-in-out;
}

.hint-enter-to,
.hint-leave-from {
    top : 100%;
    opacity: 1;
}
.hint-enter-from,
.hint-leave-to {
    top : calc(100% + 10px);
    opacity: 0;
}




@media (max-width:520px) {
    .hint-content{
        position : fixed;
        transform : translateY(0px) !important;
        left : 20px;
        width: calc(100% - 40px ) !important;
        max-width: 480px !important;
        top: unset;
    }
    .hint-enter-to,
.hint-leave-from {
    transform: translateY(0px);
    opacity: 1;
}
    .hint-enter-from,
.hint-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
}

</style>