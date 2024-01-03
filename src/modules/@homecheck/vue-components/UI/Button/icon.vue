<template>
    <div class="icon-wrapper" style="position:relative" :class="[align, size]">
    <i v-wave class="bx" :class="[`bx-${toIcon(icon)}`]"></i>
    </div>
</template>
<script>
export default {
    props:['align','icon', 'size'],
    setup(){
        function toIcon(icon){
            switch(icon){
                case 'close':
                return 'x'
                case 'edit':
                return 'edit-alt'
                case 'delete':
                return 'trash'
                default :
                return icon
            }
        }
        return {toIcon  }
    }
}
</script>
<style scoped>
.icon-wrapper{
    width:36px;
    height:36px;
}
.bx {
    color : #666;
}

.icon-wrapper i{
    font-size: 24px;
    position: absolute;
    right: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(0,0%);
    border-radius: 100%;
    transition: background 0.3s ease;
}


.icon-wrapper.sm {
    font-size: 0.8rem;
    width: 20px;
    height : 20px;
}
.icon-wrapper.md {
    font-size: 1rem;
    width: 24px;
    height : 24px;
}
.icon-wrapper.lg {
    font-size: 1.5rem;
    width: 36px;
    height: 36px;
}


.icon-wrapper.sm i {
    font-size: 0.8rem;
    width: 24px;
    height : 24px;
}
.icon-wrapper.md i {
    font-size: 1rem;
    width: 24px;
    height : 24px;
}
.icon-wrapper.lg i {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
}

.icon-wrapper.center i{
      transform: translate(0,-2px);
}

.icon-wrapper.sm.center i{
      transform: translate(0,-2px);
}

.icon-wrapper.md.center i{
      transform: translate(0,-2px);
}

.icon-wrapper.lg.center i{
      transform: translate(0,-2px);
}
.icon-wrapper i:hover
{
    background-color: var(--button-hover);
}



</style>