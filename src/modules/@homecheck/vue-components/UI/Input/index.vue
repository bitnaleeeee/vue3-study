<template>

    <div class="input-wrapper" :class="props.size">
        <input :class="[ props.inputStyle, props.size]" :maxlength="props.maxlength" v-model="Value" @keyup="changeValue" :type="props.type" :placeholder="placeholder" />
        <span class="unit">
            {{props.unit }}
        </span>
    </div>

</template>

<script setup>

const props = defineProps({
    type : String,
    inputStyle : String,
    modelValue : String | Number,
    unit : String,
  placeholder : String,
  maxlength : Number
})
const emits = defineEmits(['update:modelValue','onChanged'])

const Value = ref()

onMounted(()=>{
    Value.value = props.modelValue
})

watch(()=> props.modelValue, (to,from)=>{
    Value.value = to
})

function changeValue(){
    emits('update:modelValue', Value.value)
     emits('onChanged', Value.value)
}

</script>
<style scoped>
.input-wrapper input {
    width: calc(100% );
    font-size: inherit;
    text-align: inherit;
    padding-right: calc(1rem + 1rem);
}

.input-wrapper input.sm {
    padding : 0.2rem 0.33rem;
    max-width: 60px;
}
.input-wrapper{
    position: relative;
}

input.no-style{

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