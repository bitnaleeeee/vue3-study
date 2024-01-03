<template>
<div  class="drag-input">
    <div class="label">
        <span class="item"
        v-for="(item,i) in Array.from({length : 10})" :key="i">
        {{ ((i + 1) / 10 * props.maxX).toFixed(1) }}
        </span>
    </div>
    <div ref="el" class="graph">
        <div 
        :class="((9 - i) / 9 * props.maxY) == axisY ? 'active' : ''"
        v-for="(item,i) in Array.from({length : 10})" :key="i">
        <div>
            {{((9 - i) / 9 * props.maxY)}}
        </div>
        </div>
        <div v-if="mouseDown" class="touch"
        :style="{left : `${touch.x}px`, top : `${touch.y}px`}"
        ></div>
    </div>
</div>
</template>
<script setup>
import {ref, onMounted, watch} from 'vue'
import { useMouse } from '@vueuse/core'
import { useMousePressed, useMouseInElement } from '@vueuse/core'
import _ from 'lodash'

const el = ref(null)
const graphPressed = useMousePressed({ target: el })
const extractor = (event) => { return [event.offsetX, event.offsetY]}

const {elementX, elementY, isOutside} = useMouseInElement(el)


const props = defineProps({
    modelValue : Number,
    maxX : Number,
    maxY:  Number,
    origin : Object
})
const emits = defineEmits([
    "update:modelValue", "onChanged", "setToArray"
])

const mouseDown = ref(false)
const touch = ref({
    x:  0,
    y : 0
})

const axisY = ref(0)
const axisX = ref(0)

const moveThrottle = _.throttle(applyChanges,50)
const onChangeThrottle = _.debounce(changed,175)

watch(()=> graphPressed.pressed.value, (to,from)=>{
    if(to){
        moveThrottle()
    }
})

watch(()=> elementX.value, (to,from)=>{
    if(isOutside.value || !graphPressed.pressed.value) return
    if(!mouseDown.value) mouseDown.value = true
    moveThrottle()
})
watch(()=> elementY.value, (to,from)=>{
        if(isOutside.value || !graphPressed.pressed.value) return
    if(!mouseDown.value) mouseDown.value = true
    moveThrottle()
})



function applyChanges(){
    touch.value = {
        x : elementX.value,
        y : elementY.value
    }

    axisY.value = _.floor(( (height - elementY.value) / height * (props.maxY * 1.1 )), -1)
    axisX.value = (elementX.value / width * props.maxX) 
    if(!Array.isArray(props.origin)){
        emits("setToArray","")
    }
    emits("update:modelValue",Math.floor(( axisX.value + axisY.value)))
}

function changed(){
     if(isOutside.value){
        }
        else
        {
    emits("onChanged","")
        }
}
watch(()=> graphPressed.pressed.value, (to,from)=>{
    if(!to){
     onChangeThrottle()
    }
})


var width = 0;
var height = 0

onMounted(()=>{
    width = el.value.clientWidth;
    height = el.value.clientHeight;
})





</script>
<style scoped>
.drag-input {
    display: flex;
    flex-direction: column;
}
.label {
    display: flex;
    
}
.label > .item {
    flex: 1;
    text-align: right;
    font-size: 0.6rem;
    color : #999;
}


.touch {
    position: absolute;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    transform: translate(-50%,-50%);
    pointer-events: none;
    background: #d4dada;
    opacity: 0.5;

}
.wrapper {
        background-color: #434343;
    background-image:linear-gradient(#434343, #282828);
}
.graph {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 400px;
    height: 400px;
    box-sizing: border-box;
    border : 2px solid #d4dada;
    background-color: #f7f8f9;
}
.graph > * {
    flex: 1;
}
.graph > div {
text-align: center;
    color: #ddd;
    font-weight: 700;
    font-size: 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.graph > div:nth-child(odd){
    box-sizing: border-box;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
}
.graph > div.active {
    background: #f0f0f0;
}

/*
* Tablet
*/
@media screen and (max-width: 1023px){

}

/*
* Phone
*/
@media screen and (max-width: 768px){
.graph {
    width: 280px;
    height: 280px;
}
}


</style>