<template>
    <div  class="hint-area"  
    ref="HintArea"
    :style="{
        'z-index' : props.zIndex
        }">
        <slot />

        <teleport to="#app">
        <transition name="hint">
            <div v-if="props.modelValue" ref="Hint"
            :class="props.padding"
            :style="[`min-width: ${MinWidth ? MinWidth : props.minWidth}px;
            max-width: ${props.maxWidth}px;`,
        `z-index:${props.zIndex}`,
            
                `left : ${PositionX}px`,
                `top : ${PositionY}px` ]" 
            class="hint-content">
            <slot name="content"/>
           
            </div>
        </transition>
        </teleport>
    </div>
</template>
<script setup>
import { ref, onUnmounted, onMounted,watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import _ from 'lodash';

const props = defineProps({ 
    modelValue : Boolean,
    maxWidth : {
        type : Number,
        default : 400
    },
    minWidth :  {
        type : Number,
        default : 200
    },
    zIndex : {
        type : String,
        default : '99999'
    },
    padding : {
        type : String,
        default : ''
    },
    align : {
        default : 'left',
        type : String
    },
    
    })
const Hint = ref(null)
const HintArea = ref(null) // HintWrapper
const PositionX = ref(0)
const PositionY = ref(0)
const MinWidth = ref(0)

const emit = defineEmits(['update:modelValue', 'onOpened'])

const resizeEvent =  _.debounce(moveElement,100)

onMounted(()=>{
    if(HintArea.value){
        switch(props.width){
            case 'fill' :
                const _width = HintArea.value.getBoundingClientRect().width
                MinWidth.value = _width
            break;
        }
    }
})


window.addEventListener("resize", resizeEvent);
onUnmounted(()=>{
    window.removeEventListener("resize", resizeEvent)
})

onClickOutside(Hint, (event) => {
    emit("update:modelValue", false)
})

watch(()=> Hint.value,(to,from) =>{
    //if(to)
    //{
        moveElement();
    //}
})



function moveElement(){

        if(!Hint.value)
    {
        PositionX.value = 0
        PositionY.value = 0
        return;
    }
    let contextElement = HintArea.value.getBoundingClientRect()
    let outElement = Hint.value.getBoundingClientRect()
        
        if(props.align == "left"){                
            if((contextElement.x + outElement.width + 10) < document.body.clientWidth){
                PositionX.value = contextElement.x
            }
            else {
                PositionX.value = contextElement.x + contextElement.width - outElement.width + 10
            }

            if((contextElement.y + outElement.height + 20) > document.body.clientHeight){
                PositionY.value = contextElement.y - 5 - outElement.height
            }
            else {
                PositionY.value = contextElement.y + contextElement.height
            }
        }
        else {
            PositionX.value = contextElement.x + contextElement.width - outElement.width + 10
            if((contextElement.y + outElement.height + 20) > document.body.clientHeight){
                PositionY.value = contextElement.y - outElement.height - 5
            }
            else {
                PositionY.value = contextElement.y + contextElement.height
            }
        }
}

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
}
.hint-content {
    position: fixed;
    z-index:999;
    user-select: none;
    box-sizing : border-box;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.6;
    background: var(--background-content);
    border-radius: var(--radius);
    border : 1px solid var(--border);
    padding : 12px 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.hint-content.none {
    padding : 0;
}

.hint-enter-active,
.hint-leave-active{
    transition: opacity 0.22s ease;
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