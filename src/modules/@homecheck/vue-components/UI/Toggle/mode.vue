<template>
    <div v-wave @click="change" class="toggle" :class="mode[index] ? mode[index].style : ''">
        <span class="true" :class="mode[index] ? mode[index].style : ''">
            {{mode[index] ? mode[index].label : ''}}
        </span>
    </div>
</template>
<script>
export default{
props: ["modelValue","mode", "default"],
  emits: ["update:modelValue", "onChanged"],
  data(){
    return {
        index : -1,
        prevent : false,
    }
  },
  watch:{
    index :{
      handler(){
        this.$emit("update:modelValue", JSON.parse(JSON.stringify(this.mode[this.index])))
        this.$emit("onChanged",JSON.parse(JSON.stringify(this.mode[this.index])))
      }
    }

  },
  mounted(){
    if(this.default.property != ''){
      this.index = this.mode.findIndex(item => item[this.default.property] == this.default.value)
    }
    else
    {
      this.index = 0;
    }
  },
  methods:{
      change(){
        if(this.prevent){
          return;
        }
        this.prevent = true
        this.index = this.mode.length > this.index + 1 ? this.index + 1 : 0;
        setTimeout(()=>{this.prevent = false},700)
      }
  }
}
</script>
<style scoped>
.toggle{
    display: flex;
      margin: 0 8px 0 0;
  padding: 4px 8px;
  border: solid 1px #2f2f2f;
border-radius: 4px;
}

.toggle.active{
    border: solid 1px #fff;
background: var(--primary-gradient)
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