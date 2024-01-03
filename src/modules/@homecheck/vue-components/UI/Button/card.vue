<template>
<div @click="click_event(click)" 
class="card-btn common-border common-border-8"
:class="{disabled : disabled == true }"
v-wave="disabled ? false : {color:'#aaa'}"
>
        <div :class="{'common-space-between' : type == 'inline'}">
        <slot/>
        <span class="card-title">{{title}}</span>
        <img v-if="type == 'inline'" class="icon-more">
        </div>
        
    </div>
</template>
<script>
export default {
    props:['type', 'title', 'disabled', 'click', 'dev'],
    
    methods:{
        async click_event(fun){
          if(fun instanceof Function){
             
             await fun()
            }
            
        }
    }
}
</script>


<style scoped>
.common-border{
  border: solid 1px #eaeaea;
}
.common-border-8{
    border-radius: 8px;
}

.common-space-between{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.card-btn{
    display: block;
  margin: 10px 20px;
  padding: 16px 20px;
  text-decoration: none;
  background: #fff;
}
.card-btn.disabled{
  cursor: not-allowed;
  background: #fcfcfc;
}



.card-title{
    align-self: center;
  font-family: NotoSansKR;
  font-size: 13.5px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #2f2f2f;
}


.icon-more{
  object-fit: contain;
     content:url("@/assets/img/icn_more.svg");
}
</style>