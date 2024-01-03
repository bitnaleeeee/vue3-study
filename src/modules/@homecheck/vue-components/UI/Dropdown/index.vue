<template>
<div ref="dropdown" class="drop-down-frame" :class="{'active' : open.opened}">
<div @click="openChange" class="drop-down-preview" style="">
            <span class="subtitle" style="margin-right:5px; flex:1;">
        {{modelValue}}
    </span>
    <i class='bx bxs-down-arrow' :class="{'bx-rotate-180' : open.opened}"></i>
</div>

    <div class="drop-down">
<transition name="fade-appear">
<ul v-show="open.opened" class="drop-down-list" :class="[config.id, config.right ? 'right' : '', config.top ? 'top' : '']">
   <li @click="changeValue(item)" class="item" 
   v-wave="{
     color:'#6a6a6a'
   }"
   :class="{'active' : item == modelValue}" v-for="(item,i) in items" :key="i" >
       {{item}}
   </li>
</ul>
</transition>

    </div>
</div>
</template>
<script>
import { ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'


export default{
props: ["items", "modelValue", "align"],
  emits: ["update:modelValue"],

  mounted (){
  },
    data(){
        return {
            open: false,
            uuid : ''
        }
    },
 
    setup( props, { emit }){
      function randomString(length,withCharacter) {
	var charsNumber   = "0123456789";
	var charsLower    = "abcdefghijklmnopqrstuvwxyz";
	var charsUpper    = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
	var charsSpecial  = "!@#$%^&*()-_=+,<.>?|";
	var charsAll      = [charsNumber,charsLower,charsUpper];  //  Include special character by default but allow checkbox to toggle option
	if(withCharacter) {  //  Evaluate checkbox status
		charsAll = [charsNumber,charsLower,charsUpper,charsSpecial];
	}
	var chars         = charsAll.join('');
	var randomString  = '';
	for (var i=0; i<length; i++) {                               // Get string length
		var randNum    = Math.floor(Math.random() * chars.length);      // and then
		randomString  += chars.substring(randNum,randNum+1);            // randomize it
	}

  return randomString
}

    const dropdown = ref(null)
    const open = reactive({ opened: false});
    const config = reactive({id : randomString(7,false)})

    //console.log(uuid)
    onClickOutside(dropdown, (event) => open.opened = false)
    
    const changeValue = (item) => {
      emit("update:modelValue", item);
      open.opened = false;

    };
    onMounted(()=>{
       if(props.align == 'right')
       {
          document.getElementsByClassName(config.id)[0].style.right = 0
       }
     
    })
    const openChange = () => {
      open.opened = !open.opened
      setTimeout(()=>{
        let rect = document.getElementsByClassName(config.id)[0].getBoundingClientRect()
        if(rect.x + rect.width > window.innerWidth)
        {
          config.right = true
        }
        if(rect.y + rect.height + 20 > window.innerHeight){
          config.top = true
        }
        
      },1)
      
    };

    return { dropdown , open, changeValue, openChange, config}
    },
      methods: {
        
  },
}

</script>

<style scoped>
.drop-down-frame{
  display: flex;
  align-self:center;
  padding :4px 12px;
  border-radius: 6px;
  color:var(--font);
  background: var(--background-input);
  transition: background 0.3s ease;
}
.drop-down-frame:hover {
  background: var(--background-input-active);
}
.drop-down-list{
    margin: 0;
    padding: 5px 0;
    position: absolute;
    min-width: 150px;
    border-radius: 8px;
    background: var(--background-content);
    /*background-color: #ededed;*/
    max-height: 350px;
    overflow-y: auto;
    opacity: 0.95;
    z-index: 2;
    transition: all 0.12s ease;
}
.drop-down-list.right{
  right: 0;
}
.drop-down-list.top{
  bottom : 25px
}


.drop-down-preview{
  display: flex;
  gap: 10px;
  width : 100%;
  min-width: 50px;
  cursor: pointer;
  justify-content: space-between;
}


.drop-down-frame.active{
  /*background: #f2f2f2;*/
   background: var(--background-input)
}

.drop-down{
    position: relative;
}

.drop-down .item{
    font-size: 13.5px;
    list-style: none;
    padding: 10px 15px;
    transition: background 0.3s ease;
}
.drop-down .item:hover{
  background: var(--background-input-active);
}
/*
.drop-down .item:hover{
    background-color: #dadada;
}*/
.drop-down .item.active{
    background-color: #cacaca;
}

.fade-appear-enter-active,
.fade-appear-leave-active {
  transition: all 0.12s ease-in !important;
}

.fade-appear-enter-from,
.fade-appear-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-appear-enter-to,
.fade-appear-leave-from {
  opacity: 1;
  transform: translateY(0px);
}

</style>