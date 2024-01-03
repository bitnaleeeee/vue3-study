<template>
    <div class="input-wrapper" :class="type">
        <input v-model="Value" @keyup="changeValue" type="search" :placeholder="placeholder" />
        <span class="unit" :style="iconPosition ? `right : ${iconPosition}` : ``">
            <i class='bx bx-search'></i>
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue : String | Number,
    placeholder: String,
    type: String,
  iconPosition : String
})
const emits = defineEmits(['update:modelValue', 'onValueChanged'])

const Value = ref()

onMounted(()=>{
    Value.value = props.modelValue
})

function changeValue(){
    emits('update:modelValue', Value.value)
    emits('onValueChanged', Value.value)
}

</script>
<style scoped>
input {
    width: 100%;
}
input::-ms-clear,
input::-ms-reveal{
	display:none;width:0;height:0;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button,
input::-webkit-search-results-button,
input::-webkit-search-results-decoration{
	display:none;
}
.input-wrapper{
    position: relative;
}

.unit {
    position: absolute;
    font-size: 1.25rem;
    right: 2rem;
    transform : translateY(-50%);
    top : 50%;
    color : #666;
    opacity: 0.5;
    font-weight: 500;
    user-select: none;
}

.input-wrapper.black > input {
    background: #f9fafc;
    border: none;
    border-radius: 100rem;
    font-size: 1.25rem;
    padding : 1.6rem 2rem;
}

</style>