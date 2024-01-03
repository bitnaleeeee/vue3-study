<template>
        <input class="input" :class="[props.size]" :disabled="props.disabled" :maxlength="props.maxlength" v-model="Value" @keyup="changeValue" :type="props.type" :placeholder="placeholder" />
</template>

<script setup>
const props = defineProps({
    type : String,
    modelValue : String | Number,
  placeholder : String,
  maxlength : Number,
  disabled : Boolean,
  size : String
})
const emits = defineEmits(['update:modelValue'])

const Value = ref()


watch(()=> props.modelValue , (to,from)=>{
    Value.value = to
})

function changeValue(){
    emits('update:modelValue', Value.value)
}

</script>
<style scoped>
.input {
    background : none;
    border : none;
    width: min-content;
    border-bottom: 1.5px solid #dadada;
}

.input.lg{
    font-size: 1.25rem;
    font-weight: 500;
}

.unit {
    position: absolute;
    right: 10px;
    transform : translateY(-50%);
    top : 50%;
    color : #666;
    opacity: 0.5;
    font-weight: 500;
    user-select: none;
}
</style>