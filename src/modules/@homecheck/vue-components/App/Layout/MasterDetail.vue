<template>
<div class="master-detail-layout">
  <AppLayoutStatusbar/>
  <div class="sidebar-layout">
    <slot name="side"/>
    <div class="master-layout" :class="props.mobile_detail_open ? 'active' : ''">
        <div class="mobile-only mobile-close">
            <i v-wave @click="close" class='bx bx-x'></i>
        </div>
        <slot name="detail"/>
    </div>
  </div>
</div>
</template>
<script setup>
import {ref} from 'vue'

const props = defineProps({
    mobile_detail_open : {
        default : false,
        type : Boolean
    }
})

const emits = defineEmits(["update:mobile_detail_open"])


function close(){
    emits("update:mobile_detail_open",false)
}



</script>

<style scoped>
.master-detail-layout {
  display: flex;
  flex-direction: column;
}

.sidebar-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex: 1;
}

.mobile-close {
    display: none;
    padding : 0.6rem 1.2rem 0 1.2rem;
    font-size: 1.5rem;
    border-top: 1px solid #d4d4d4;
    justify-content: flex-end;
}

.mobile-close > i {
    border-radius: 50%;
    padding : 0.3rem;
}


</style>
<style>



.sidebar-layout > *:first-of-type {
    flex: 2;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d4dada;
  background: #fff;
  overflow: hidden;
}

.sidebar-layout > *:last-of-type {
  background: #fff;
  z-index: 1;
  flex: 5.5;
  position: relative;
}

.mobile-only {
    display: none;
}




/*
* Tablet
*/
@media screen and (max-width: 1023px){
    .sidebar-layout > *:first-of-type {
        flex: 3
    }
    .sidebar-layout {
        position: relative;
    }
}

/*
* Phone
*/
@media screen and (max-width: 768px){
    .sidebar-layout > *:last-of-type {
        position: absolute;
        width: 100%;
        height: 98%;
        bottom : 0;
        z-index: 2;
        transition: transform 0.3s ease, opacity 0.22s ease;
        transform: translateY(20%);
        opacity: 0;
        pointer-events: none;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }
    .sidebar-layout > *:last-of-type.active {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
    }
    .mobile-close {
        display: flex !important;
        justify-content: flex-end;
    }
}
</style>
