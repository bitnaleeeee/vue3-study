<template>
    <div class="hck-autocomplete" :class="random" @keyup="keyup">
        <input v-model="InputValue"  :class="open? '' : 'closed'" style="width:100%" @keyup="openExpand('force')" @click="openExpand('force')"/>
        <span v-show="!open" style="position:absolute; left: 0 ; padding: 6px 10px">{{InnerValue}}</span>
        <i class='bx bx-search' style="position:absolute; top: 9px; right: 12px;"></i>
        <transition name="autocomplete">
        <div v-if="open" class="expand" ref="Expand" >
            
            <UIButton v-if="props.addItem" class="item" style="text-align:center; color:var(--primary)" @click="addItem">
                 추가하기
            </UIButton>
            <div class="item"
            :class="[item == Selected ? 'selected' : '', i == SelectedIndex ? 'highlight' : '']"
             v-for="(item,i) in Items" :key="i" @click="changeSelection(item)">
                <input v-model="checked[item]" type="checkbox" />
                {{item}}
            </div>
            <div>
            </div>
        </div>
        </transition>
    </div>
</template>

<script setup>
import _ from 'lodash'
import { onClickOutside } from '@vueuse/core'
const checked = ref({})
const open = ref(false)
const InputValue = ref('')
const InnerValue = ref(computed(()=>{
    return _.join( Selected.value, ', ')
}))
    const Expand = ref(null)
const random = `hck-autocomplete-${useUI().common.rstr(5,false)}`

    onClickOutside(Expand, (event) =>{
         console.log(event)
    open.value= false
    })

const props = defineProps({
    Items: Array,
    modelValue : String,
    addItem : Function,
    type : String
})
const SelectedIndex = ref(-1)
const Selected = ref(computed(()=>{
   let returnValue;
returnValue = calculateValue(props.type)    
    
  emit('update:modelValue', returnValue)
  return returnValue;
}))

const emit = defineEmits(['update:modelValue'])

function addItem(){
    props.addItem();
}
function calculateValue(type){
    let returnValue ;
    if(type =='radio')
    {
       returnValue = checked.value
    }
    else
    {
        returnValue = [];
for (let check of Object.keys(checked.value)){
       if (checked.value[check]){
           returnValue.push(check)
       }
    }
    }
    return returnValue
}

function changeSelection(value){
    checked.value[value] = !checked.value[value]  
    setTimeout(()=>{
        document.getElementsByClassName(random)[0].children[0].focus()
    },50)
}
function changeSelectionArrow(key){    
    if(SelectedIndex.value < 0)
    {
        SelectedIndex.value = 0;
        return;
    }
        switch(key)
        {
            case 'ArrowUp' :
                if(SelectedIndex.value > 0)
                {
               SelectedIndex.value--
                };
            break;
            case 'ArrowDown' :
             if(SelectedIndex.value < (props.Items.length - 1))
                {
                SelectedIndex.value++;
                }
            break;     
        }
}

function openExpand(arg){
    if(arg == 'force'){
        open.value = true
        //Items 변화 => autocomplete
        return;
    }
    if(open.value)
    {
        open.value = false
    }
    else
    {
        open.value = true
    }
}

function keyup(key){
    if(open.value)
    {
        switch(key.key)
        {
            case 'Escape' :
                open.value=false
            break;
            case 'ArrowUp' :
            case 'ArrowDown' :
                changeSelectionArrow(key.key)
            break; 
            case 'Enter' :
                  changeSelection(props.Items[SelectedIndex.value])
            break;
        }
    }
}

</script>
<style scoped>
.hck-autocomplete{
    position: relative;
    width: 100%;
}
.expand {
    z-index: 2;
    position: absolute;
    display: flex;
    gap:4px;
    flex-direction: column;
    width: 100%;
    min-height: 100px;
    box-sizing: border-box;
    background : var(--background-content);
    border : 1px solid var(--border);
    padding : 6px;
        transform: translate(0, 10px);
}
.expand .item{
    padding : 6px;
    border-radius: var(--radius);
    transition: all 0.12s ease;
}
.expand .item:hover{
    background: var(--background);
    cursor: pointer;
}
.expand .item.highlight{
    background : #f5f6f7;
}
.expand .item.selected{
    background : #e6e7e7;
    color : var(--primary);
    font-weight: 500;
}
.closed{
    color: rgba(0,0,0,0);
}
.autocomplete-enter-active,
.autocomplete-leave-active{
    transition: all 0.2s ease;
}

.autocomplete-enter-to,
.autocomplete-leave-from{
    opacity: 1;
    transform: translate(0, 10px);
}

.autocomplete-enter-from,
.autocomplete-leave-to{
    opacity: 0;
    transform: translate(0, -5px);
}
</style>