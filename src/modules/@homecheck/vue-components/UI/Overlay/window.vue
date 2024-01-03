<template>
    <transition name="window">
        <div v-if="props.modelValue" class="window-background" 
        :style="`z-index:${props.zIndex}`"
        @click="close">
            <div class="content" :class="[props.option.fullSize ? 'fullSize' : '',
            props.option.scroll ? 'scroll' : '']">
                <slot/>
            </div>
        </div>
    </transition>
</template>
<script setup>
const props = defineProps({
    modelValue : Boolean,
    option : {
        type : Object,
        default : {
                blockClose : false,
                fullSize : false,
                scroll : false
        }
        
    },
    zIndex : {
        type : String,
        default : '1000000'
    }
})

const emits = defineEmits(['update:modelValue', 'onClosed'])


function close(event){
   if(event.srcElement.className.includes('window-background') && !props.option.blockClose)
   {
    emits('update:modelValue', false)
    emits('onClosed',null)
   }
}

</script>
<style scoped>
.window-leave-active,
.window-enter-active,
.window-enter-active.window-background > .content,
.window-leave-active.window-background > .content
{
    transition : all 0.2s ease;
}

.window-enter-from.window-background,
.window-leave-to.window-background {
    
    backdrop-filter: blur(-1px);
    
    opacity: 0;
}

.window-enter-to.window-background,
.window-leave-from.window-background {
    
    backdrop-filter: blur(4px);
    
    opacity: 1;
}


.window-enter-from.window-background > .content,
.window-leave-to.window-background > .content {
    top : 49.5%;
    opacity: 0;
}

.window-enter-to.window-background > .content,
.window-leave-from.window-background > .content {
    top : 48%;
    opacity: 1;
}



.window-background{
    position: fixed;
    background: #ffffff00;
    left : 0;
    top : 0;
    width : 100vw;
    height : 100vh;
    /*
    overflow : hidden;
    */
    backdrop-filter: blur(4px);
    
    z-index : 10000000;
}


.window-background .content{
    position: absolute;
    left : 50%;
    top : 48%;
    /*
    overflow: auto;
    */
    transform: translate(-50%, -50%);
    max-height: 93vh;
    max-width: 93vw;
box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
}

.window-background .content.scroll {
    overflow: hidden;
}



.window-background .content.fullSize{
    height: 93vh;
    width: 93vw;
    max-width: 1200px;
}


@media screen and (max-width: 540px) {
	/* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */
.window-background .content.fullSize{
    height: 100vh;
    width: 100vw;
    max-height: 100vh;
    max-width: 100vw;
    top : 0;
    left : 0;
    transform: none;
}
}


/*
* Tablet
*/
@media screen and (max-width: 1023px){

}

/*
* Phone
*/
@media screen and (max-width: 768px){

}

</style>