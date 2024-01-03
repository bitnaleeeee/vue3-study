<template>
    <div ref="InputArea" class="input-area" 
    
    :style="`max-length: ${props.maxlength == 999 ? 100 : (props.maxlength * 20)}px`"
    :class="[inputFocused ? 'input-focused' : '', props.padding ]">
        <input type="text" v-model="inputValue" class="number-input" :class="inputFocused ? 'input-focused' : '' " 
        @focus="focus"  readonly/>
        <div class="unit">
            {{props.unit}}
        </div>
        
    <teleport to="#app">
        <transition name="number-pad">
            <div v-if="inputFocused" ref="NumberPad" 
            :style="[
                `min-width : ${NumberCheck(props.width)}`, 
                `left : ${PositionX}px`,
                `top : ${PositionY}px` 
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
             <div  @click="InputKey('모두 지우기')" v-wave class="keypad init" style="grid-column-start : 1; grid-column-end : 3;">
                모두 지우기
            </div>
            <div  @click="InputKey('확인')" v-wave class="keypad init" style="grid-column-start : 3; grid-column-end : 4;">
                확인
            </div>

            
            
            </div>
        </transition>
    </teleport>

    </div>
</template>
<script setup>
import { onClickOutside } from '@vueuse/core'
import { ref,watch, watchEffect } from 'vue'
const props = defineProps({ 
    modelValue : [Number, String], 
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
    width : {
        default : '100%',
        type : [ Number, String ]
    },
    padding : {
        default :"",
        type : String
    }
    })
    
const emit = defineEmits(['update:modelValue', 'onChanged'])
const inputFocused = ref(false)
const inputValue = ref('')
const InputArea = ref(null)
const NumberPad = ref(null)
const PositionX = ref(0)
const PositionY = ref(0)

const FirstInput = ref(true)


onClickOutside(InputArea, (event) => { 
    if(!event.target.classList.contains('keypad')){
inputFocused.value = false 
    }
    })

watchEffect(() => { 
    inputValue.value = props.modelValue ? props.modelValue.toString() : '0' 
    })
watch(()=> NumberPad.value,(to,from) =>{ adjustElement() })
watch(()=> inputFocused.value, (to, from)=>{
    if(!to){
        if(inputValue.value.length == 0){
            inputValue.value = 0
        }
        inputValue.value = `${parseFloat(inputValue.value) }`

               if (props.allowPoint) {
        emit("update:modelValue", parseFloat(inputValue.value).toFixed(2))
        emit("onChanged", parseFloat(inputValue.value).toFixed(2) )
        }
        else {
        emit("update:modelValue", parseFloat(inputValue.value))
        emit("onChanged", parseFloat(inputValue.value))
            
        }
    }
    if(to){
        FirstInput.value= true
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
        PositionX.value = 0
        PositionY.value = 0
        return;
    }
    let numberpad = NumberPad.value.getBoundingClientRect()
    let inputarea = InputArea.value.getBoundingClientRect()
        
        if(props.align == "left"){
                
            if((inputarea.x + numberpad.width + 10) < document.body.clientWidth){
                PositionX.value = inputarea.x
            }
            else {
                PositionX.value = inputarea.x + inputarea.width - numberpad.width + 10
            }

            if((inputarea.y + numberpad.height + 20) > document.body.clientHeight){
                PositionY.value = inputarea.y - 5 - numberpad.height
            }
            else {
                PositionY.value = inputarea.y + inputarea.height
            }
        }
        else {
            PositionX.value = inputarea.x + inputarea.width - numberpad.width + 10
            if((inputarea.y + numberpad.height + 20) > document.body.clientHeight){
                PositionY.value = inputarea.y - numberpad.height - 5
            }
            else {
                PositionY.value = inputarea.y + inputarea.height
            }
        }
        /*
        if((width + x) > document.body.clientWidth)
        {
            PositionX.value = ((width + x + 25) - document.body.clientWidth).toFixed(0)
        }
        if((height + y) > document.body.clientHeight){
            PositionY.value = height + wrapper.height + 5
        }
        */
}

function InputKey(key){
    switch(key){
        case '확인' :
            inputFocused.value= false;
        break;
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
        if(FirstInput.value){
            FirstInput.value = false
            inputValue.value = `${key}`
        }
        else
        {
        inputValue.value = `${inputValue.value}${key}`
        }
        break;
    }
}



function focus (e){
    inputFocused.value = true;
}

</script>
<style scoped>
.input-area.input-focused {
    border-color: var(--primary);
    background: rgb(242, 245, 249);
}

.unit {
    color : var(--primary-caption);
    font-size: 0.8rem;
}
.input-area{
    max-width: 8rem;
    display: flex;
    align-items: center;
    position: relative;
    overflow: visible;
    padding: 0.2rem 0.4rem;
    background: #fff;
    border-radius: var(--radius);
    border: 1px solid #f0f0f0;
    box-sizing: border-box;
}



.input-area.none {
    padding  : 0 !important
}
.number-input {
    flex: 1;
    text-align: right;
    border: none;
    outline: none;
    min-height:1.5rem;
    padding : 0 0.4rem;
    box-sizing: border-box;
    background: transparent;
    width:100%;
}

.input-area.none > .number-input{
    padding  : 0 !important;
    text-align: center;
    color : var(--primary-caption);
}

.input-area.min {
    padding : 0 0.2rem;
    max-width: 3rem;
    margin: 0 auto;
    background: #f9fafc;
}
.input-area.min > .number-input {
    min-height: 1rem;
    font-size: 0.7rem;
    padding : 0.1rem 0.2rem;
}

.input-area.min > .unit {
    font-size: 0.5rem;
}



.number-pad {
    position: fixed;
    z-index:9999999999;
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
    overflow: visible;
}

.number-pad .keypad{
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
.number-pad .keypad.init{
    font-size: 16px; 
}


.number-pad-enter-active,
.number-pad-leave-active{
    transition: opacity 0.22s ease;
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
        position : absolute;
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