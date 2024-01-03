<template>
  <div

    class="accordion common-border common-border-8"
    @click="openMethod(false)"
    :class="[type ? type : '']"
    v-wave="
    option.onlyPreviewOpen ? false :
    {
      color: type == 'primary' ? '#050507' : '#aaa',
    }"
  >
    <slot name="header" />

    <div 
    style="cursor:pointer;"
    class="contents common-border-8" 
    @click="openMethod(true)"
     v-wave="
    !option.onlyPreviewOpen ? false :
    {
      color: type == 'primary' ? '#050507' : '#aaa',
    }" >
      <slot name="preview"  />
      <i style="font-size:24px; height: fit-content; margin-right:10px;" class='bx bx-chevron-down ' :class="open ? 'bx-rotate-180' : ''"></i>
   </div>
    <div>
      <UITransitionExpand :type="option.openDuration ? option.openDuration : ''">
        <div v-if="open" class="inner">
          <slot name="inner" />
        </div>
      </UITransitionExpand>
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>
<script>
export default {
  props: ["type", "opened","options"],
  data() {
    return {
      open: false,
      prevent : false
    };
  },
  mounted(){
    this.open = this.opened ? this.opened : false;
  },
  computed: {
    isOpened() {
      this.open = this.opened ? this.opened : false;
      return this.open;
    },
    option(){
      return this.options ? this.options : {}
    }
  },
  methods: {
    openMethod(bool) {
      if(this.prevent){
        return;
      }
      if(this.options.onlyPreviewOpen == bool)
      {
        this.prevent = true;
        this.open = !this.open;
        setTimeout(()=>{
          this.prevent = false
        },1200)
      }
    },
  },
};
</script>
<style scoped>
.common-border{
  border: solid 1px #eaeaea;
}
.common-border-8{
    border-radius: 8px;
}

.rotate-180{
    transform: rotate(-180deg);
}
.accordion {
  display: flex;
  flex-direction: column;
  margin: 10px 20px;
  padding: 16px 20px;
  background-color: #fff;
}

.accordion.no-style{
  margin : 0;
  padding : 0;
  border:none;
  border-radius: 0px;
  background : none;
}

.accordion.no-style .contents{
  border-radius: 0;
}
.accordion.primary {
  background: linear-gradient(250deg, #8941e4, #6153fb);
}

.accordion.line,
.accordion.bottom-line{
  margin : 10px;
  padding : 0;
  border:none;
}

.accordion.bottom-line .contents,
.accordion.line .contents {
  display: flex;
  padding : 6px 10px;
  cursor : pointer;
  justify-content: space-between;
  transition: 0.3s all ease;
  align-items: center;
}

.accordion.bottom-line .contents:hover,
.accordion.line .contents:hover{
  background: #f5f6f7;
  opacity: 0.8;
}


.accordion.bottom-line .contents1:after{
  position: absolute;
  width:100%;
  height: 1px;
  content: '';
  border-bottom: 1px solid black;
}

.accordion.bottom-line .inner,
.accordion.line .inner{
  padding : 0 10px
}


.accordion .contents {
  display: flex;
  justify-content: space-between;
}
.icon-animation {
  transition: all 0.3s ease;
}
</style>