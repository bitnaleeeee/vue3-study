<template>
    <div v-wave @click="change" class="toggle" :class="modelValue ? 'active' : ''">
        <span v-show="modelValue" class="true" :class="modelValue ? 'active' : ''">
        <slot name="true"/>
        </span>
        <span v-show="!modelValue" class="false" :class="modelValue ? '' : 'active'">
        <slot name="false"/>
        </span>
    </div>
</template>
<script>
export default{
props: ["modelValue"],
  emits: ["update:modelValue"],
  methods:{
      change(){
          if(this.modelValue)
          {
      this.$emit("update:modelValue", false);
          }
          else{
              this.$emit("update:modelValue", true);
          }
      }
  }
}
</script>
<style scoped>
.toggle{
    display: flex;
  padding: 4px 8px;
  border: solid 1px #2f2f2f;
border-radius: 4px;
}
.toggle.active{
    border: solid 1px #fff;
background: #0f0f0f;
}

.toggle span{
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left
}
.toggle.active .true.active{
    color: #fff;
}
.toggle .false.active{
    color: #2f2f2f;
}
</style>