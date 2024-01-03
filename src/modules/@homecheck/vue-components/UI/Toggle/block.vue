<template>
    <div class="layout" 
    
            :class="[props.modelValue ? 'active' : '',
        props.disabled ? 'disabled' : '']" @click="
        ()=>{
            if(!props.disabled){
            changeModelValue()
            }
        }">
        <slot/>
        <div class="checkbox">
            <i v-if="props.modelValue" class='bx bxs-checkbox-checked' ></i>
            <i v-else class='bx bxs-checkbox' ></i>
        </div>
    </div>    
</template>
<script setup>
import {ref} from 'vue'

const props = defineProps({
    modelValue: Boolean,
    disabled: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:modelValue'])


function changeModelValue() {
    emits('update:modelValue', !props.modelValue)
}


</script>
<style scoped>
.layout{
    border-radius: var(--radius);
    border : 2px solid #f0f0f0;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    padding :0.8rem 1.2rem;
    cursor : pointer;
    gap : 0.12rem;
    align-items: center;
    position: relative;
    background: #fff;
}

.layout:hover {
    background: #f9fafc;
}

.layout.active {
    border : 2px solid #0f0f0f;
}

.checkbox {
    position: absolute;
    left : 0.2rem;
    top : 0.2rem;
    font-size: 1.25rem;
}
.checkbox > .bxs-checkbox-checked{
    color : #0f0f0f;
}
.checkbox > .bxs-checkbox{
    opacity: 0.3;
}

</style>