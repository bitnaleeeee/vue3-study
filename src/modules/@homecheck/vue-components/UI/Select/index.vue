<template>
<UIContext v-model="open" padding="none" zIndex="999999">
    <div class="selected-item" 
    :class="open ? 'active' : ''"
    @click="open = !open">
        <div>{{ props.label }}</div>
        <i class='bx bx-caret-down'></i>
    </div>
    <template #content>
        <div class="select-items">
            <div v-for="(item,i) of props.items" :key="i" class="item"
            :class="props.modelValue == item.value ? 'active' : ''"
            @click="changeValue(item.value)"
            >
                {{ item.label }}
            </div>
        </div>
    </template>
</UIContext>    
</template>
<script setup>
import {ref, computed} from 'vue'
import UIContext from '../Context/index.vue'

const open = ref(false)

const props = defineProps({
    modelValue : String | Number | Array | Object,
    items: Array | Object,
    label : String
})
const emits = defineEmits(['update:modelValue'])



function changeValue(val) {
    emits("update:modelValue", val)
}


</script>
<style scoped>
.selected-item{
    padding : 0.4rem 0.8rem;
    border-radius: var(--radius);
    border : 1px solid #d4dada;
    display: flex;
    align-items: center;
     gap : 0.5rem;
     transition: all 0.2s ease;
     justify-content: end;
}
.selected-item.active {
    opacity: 0.6;
    background: #d4dada;
}

.select-items {
    max-height: 50vh;
    display: flex;
    flex-direction: column;
}

.select-items > .item {
    padding : 0.3rem 0.6rem;
}
.select-items > .item:hover {
    background: #f9fafc;
}
.select-items > .item.active {
    background: #0f0f0f !important;
    color : #fff;
}

</style>