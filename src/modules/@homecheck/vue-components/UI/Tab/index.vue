<template>
<div>
    <div class="tab-frame">
        <div @click="changeTab(i)" v-wave="{
            color:'#aaa'
        }" class="tab" :class="[i == inner_index ? 'active' : '']" v-for="(item,i) in items" :key="i">
            {{item.label}}
            <div class="border-bottom">
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default{
props: ["items",'index'],
  emits: ["update:items","update:index","onChange"],
  data(){
      return {
          inner_index : 0
      }
  },
  methods:{
      changeTab(i){
          this.inner_index = i;
          let emit_value = {
            index : this.inner_index,
            label : this.items[this.inner_index].label,
            value : this.items[this.inner_index].value
          }
          this.$emit("update:index", emit_value );
          this.$emit("onChange", emit_value)
      }

  },
  mounted(){
      this.inner_index = this.index.index ? this.index.index : 0
  }
}
</script>
<style scoped>
.tab-frame{
    display: flex;
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
    background: #fafafa;
}
.tab{
    flex: 1 1 0;
    text-align: center;
      font-family: NotoSansKR;
  font-size: 13.5px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2f2f2f;
  padding: 12px 0 0 0;
}

.tab.active{
    color: var(--primary);
    font-weight: 500;
}
.border-bottom{
     height: 1px;
    margin-top:11px;
}

.tab.active .border-bottom{
   
    background: var(--primary-gradient);
}



</style>