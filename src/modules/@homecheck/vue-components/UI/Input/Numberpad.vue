<template>
    <div ref="InputArea" class="input-area">
        <input v-model="inputValue" :class="inputFocused ? 'input-focused' : '' " 
        @focus="focus"  readonly/>
        <transition name="number-pad">
            <div v-if="inputFocused" ref="NumberPad" 
            :style="[
                `min-width : ${NumberCheck(props.width)}`, 
                PositionX ? `transform : translateX( -${PositionX}px);` : '' 
                ]" 
            class="number-pad">
            <div v-for="item in [1,2,3,4,5,6,7,8,9]" 
            @click="InputKey(item)"
            :key="item" v-wave class="keypad">
                {{item}}
            </div>
            <div  @click="allowPoint ? InputKey('.') : null" v-wave class="keypad">
                {{ allowPoint ? '.' : '' }}
            </div>
            <div  @click="InputKey(0)" v-wave class="keypad">
                0
            </div>
            <div  @click="InputKey('지우기')" v-wave class="keypad">
                <i class='bx bx-arrow-back'></i>
            </div>
             <div v-if="allClear"  @click="InputKey('모두 지우기')" v-wave class="keypad init" style="grid-column-start : 1; grid-column-end : 4;">
                모두 지우기
            </div>

            
            
            </div>
        </transition>
    </div>
</template>
<script setup>
import { onClickOutside } from '@vueuse/core'
const props = defineProps({ 
    modelValue : Number, 
    align : {
        default : 'left',
        type : String
    },
    unit : {
        default : '',
        type : String
    },
    maxlength : {
        default : 999,
        type : Number
    },
    allowPoint : {
        default : true,
        type : Boolean
    },
    allClear : {
        default : true,
        type : Boolean
    },
    width : {
        default : '100%',
        type : [ Number, String ]
    }
    })
    
const emit = defineEmits(['update:modelValue'])
const inputFocused = ref(false)
const inputValue = ref('')
const InputArea = ref(null)
const NumberPad = ref(null)
const PositionX = ref(null)

onClickOutside(InputArea, (event) => { inputFocused.value = false })

watch(()=> NumberPad.value,(to,from) =>{ adjustElement() })
watch(()=> inputFocused.value, (to, from)=>{
    if(!to){
        if(inputValue.value.length == 0){
            inputValue.value = 0
        }
        inputValue.value = `${parseFloat(inputValue.value)}`
         emit("update:modelValue", parseFloat(inputValue.value))
    }
    if(to){
        if(inputValue.value.includes(props.unit)){
           // inputValue.value = inputValue.value.substr( inputValue.value.length - props.unit.length)
        }
    }
})

function NumberCheck(val){
    const type = typeof val
    switch(type)
    {
        case 'string' :
            return val
        break;
        case 'number' :
            return `${val}px`
        break;
    }
}


function adjustElement(){
    if(!NumberPad.value)
    {
        PositionX.value = ``
        return;
    }
    let element = NumberPad.value.getBoundingClientRect()
        let width = element.width
        let x = element.x
        if((width + x) > document.body.clientWidth)
        {
            PositionX.value = `${(width + x) - document.body.clientWidth }`.split('.')[0]
        }
}

function InputKey(key){
    switch(key){
        case '모두 지우기':
            inputValue.value =''
        break;
        case '지우기' :
            inputValue.value = `${inputValue.value.substring(0, inputValue.value.length - 1)}`
        break;
        case '.' :
        if(inputValue.value.includes('.')) return;
        if(inputValue.value.length == 0){
            inputValue.value = `0${key}`
            return
        }
        default :
        if(inputValue.value.length >= props.maxlength)
        {
            return;
        }
        inputValue.value = `${inputValue.value}${key}`
        break;
    }
}



function focus (e){
    inputFocused.value = true;
}

</script>
<style scoped>
input.input-focused {
    border-color: var(--primary);
}

.input-area{
    position: relative;
    z-index : 999;
}

.input-area .number-pad {
    position: absolute;
    z-index:999;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(40px, auto);
    user-select: none;
    box-sizing : border-box;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.6;
    background: var(--background-content);
    border-radius: var(--radius);
    border : 1px solid var(--border);
    padding : 4px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    top: 100%;
}

.input-area .number-pad .keypad{
    display:flex;
    flex-direction: column;
    justify-content: center;
    font-size: 20px;
    text-align: center;
    color : #999;
    border : 1px solid #eaeaea;
    /*align-self: center;*/
    height: 100%;
}
.input-area .number-pad .keypad.init{
    font-size: 16px; 
}






.number-pad-enter-active,
.number-pad-leave-active{
    transition: opacity 0.22s ease, top 0.22s ease-in-out;
}

.number-pad-enter-to,
.number-pad-leave-from {
    top : 100%;
    opacity: 1;
}
.number-pad-enter-from,
.number-pad-leave-to {
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
.number-pad-leave-from {
    transform: translateY(0px);
    opacity: 1;
}
.number-pad-enter-from,
.number-pad-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
}

</style>