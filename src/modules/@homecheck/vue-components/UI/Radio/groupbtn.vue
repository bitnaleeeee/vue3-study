<template>
  <div class="groupbtn common-border common-border-8" :class="[props.size ? props.size : '']">
    <div
      @click="To(i)"
      class="btn"
      :class="{ active: i == props.modelValue }"
      v-for="(item, i) in props.items"
      :key="i"
      v-wave
    >
      <span class="text">
        {{ item }}
      </span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  items : Array,
  modelValue : Number,
  size : String
})

const emits = defineEmits(["update:modelValue"])

function To(i) {
  console.log('to : ', i)
  emits("update:modelValue", i);
}

watch(()=>props.items , (to,from)=>{
 emits("update:modelValue", 0);
})
  

</script>
<style scoped>
.common-border{
  border: solid 1px #eaeaea;
}
.common-border-8{
    border-radius: 8px;
}

.groupbtn {
  display: flex;
  border: solid 1px #eaeaea;
  background-color: #fff;
min-width:120px;
width:inherit;
height:100%;
  font-size: 13.5px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #2f2f2f;
}


.btn {
  padding: 0.5rem 0;
  flex: 1;
  text-align: center;
  box-sizing: border-box;
}
.sm .btn{
  padding: 6px 0;
  font-size: 12px;
}

.btn .text {
  width: 100%;
}
.btn.active {
  background: var(--primary-gradient);
}

.btn.active .text {
  flex-grow: 0;
  font-weight: 500;
  text-align: left;
  color: #fff;
}



.btn:first-child {
  border-radius: 8px 0 0 8px;
}
.btn:last-child {
  border-radius: 0 8px 8px 0;
}

.btn:only-child{
  border-radius: 8px;
}
.btn:nth-last-child(n-1) {
  height: 100%;
  width: 1px;
  border-right: 1px #eaeaea solid;
}
</style>