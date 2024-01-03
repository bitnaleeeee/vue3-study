<template>
    <div class="step ui-step">
        <div class="body">
            <slot name="header"/>



<div class="step-contents" style=" flex:1">
    <transition :name="stepTransition" :duration="props.animation ? 350 : 0">
        <div class="step-component" v-if="props.index == 0" >
            <slot name="0"/>
        </div>
        <div class="step-component" v-else-if="props.index == 1" >
            <slot name="1"/>
        </div>

        <div class="step-component" v-else-if="props.index == 2" >
            <slot name="2"/>
        </div>

        <div class="step-component" v-else-if="props.index == 3" >
            <slot name="3"/>
        </div>

        <div class="step-component" v-else-if="props.index == 4" >
            <slot name="4"/>
        </div>

        <div class="step-component" v-else-if="props.index == 5" >
            <slot name="5"/>
        </div>

        <div class="step-component" v-else-if="props.index == 6" >
            <slot name="6"/>
        </div>
                <div class="step-component" v-else-if="props.index == 7" >
            <slot name="6"/>
        </div>
                <div class="step-component" v-else-if="props.index == 8" >
            <slot name="6"/>
        </div>
                <div class="step-component" v-else-if="props.index == 9" >
            <slot name="6"/>
        </div>
                <div class="step-component" v-else-if="props.index == 10" >
            <slot name="6"/>
        </div>



    </transition>
</div>





        </div>
         <slot name="footer"/>
    </div>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue'
const props = defineProps({
    index: Number,
    animation: {
        type: Boolean,
        default : true

    }
})

const stepTransition = ref(props.animation ? 'step-to' : '')

watch(() => props.index, (to, from) => {
    if (!props.animation) {
 return "none"
    }
    if (from < to)
    {
        stepTransition.value = 'step-to'
    }
    else
    {
        stepTransition.value = 'step-from'
    }
})





</script>
<style scoped>
.step{
    display: flex;
    flex-direction:column; 
    height:100%;
    min-height: inherit;
}
.step > .body{
    display: flex;
    flex:1; 
    flex-direction:column; 
    height:100%;
    overflow-y: hidden;
}


.step-contents{
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
}

.step-component{
    /*position: absolute;*/
    min-height:100%;
    height: 100%;
    width:100%;
}

.step-to-enter-active,
.step-to-leave-active,
.step-from-enter-active,
.step-from-leave-active{
  transition: all 0.35s ease;
  position: absolute;
}


.step-to-enter-from{
  transform: translateX(7%);
  opacity: 0;
}

.step-to-leave-to{
  transform: translateX(-7%);
  opacity: 0;
}
.step-to-enter-to,
.step-to-leave-from{
  transform: translateX(0px);
  opacity: 1;
}




/* from */
.step-from-enter-from{
  transform: translateX(-7%);
  opacity: 0;
}

.step-from-leave-to{
  transform: translateX(7%);
  opacity: 0;
}
.step-from-enter-to,
.step-from-leave-from{
  transform: translateX(0px);
  opacity: 1;
}
</style>