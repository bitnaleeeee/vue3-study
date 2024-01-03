<template>
<div 
class="card common-border common-border-8"
:class="[{disabled : disabled == true }, type ? type : '', size ? size : '', option.noMargin ? 'no-margin':'']"

>
        <slot/>
    </div>
</template>
<script>
export default {
    props:['type', 'disabled','size', 'options'],
    computed:{
      option(){
        return this.options ? this.options : {}
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

.card{
    display: block;
  margin: 10px 20px;
  padding: 16px 20px;
  text-decoration: none;
  background: #fff;
}
.card.no-margin{
  margin: 0;
}

.card.slim{
  padding: 12px;
}

.card.none{
  padding: 0;
  margin: 0;
  border : none;
}

.card.disabled{
  cursor: not-allowed;
  background: #fcfcfc;
}

.common-border.notice{
    background: #f4f7f8;
    border: solid 1px #eee;
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