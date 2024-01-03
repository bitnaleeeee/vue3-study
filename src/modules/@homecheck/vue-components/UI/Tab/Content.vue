<template>

<div
 class="UItabs"
v-show="modelValue == item"
 v-for="(item,i) in Array.from(Array(10).keys())" :key="i" 
 :class="[`tab-${i}`]" style="overflow-y: auto;" 
 :style="{'flex' : modelValue == item ? '1' : '0'}">
<slot :name="item"/>
</div>

</template>
<script>
export default {
    props: ["modelValue"],
    data(){
        return {
        previous_index : -1
        }
    },
    watch:{
        modelValue(to,from){
            this.previous_index = (to - from) < 0 ? 'left-to-right' : 'right-to-left'
        }
    }

}
</script>
<style scoped>
.UItabs{
    background: #fff;
}

.left-to-right-enter-active{
    z-index: 2;
}
.left-to-right-leave-active{
    z-index: 1;
}

.left-to-right-enter-active,
.left-to-right-leave-active,
.right-to-left-enter-active,
.right-to-left-leave-active
{
    position: absolute;
    width: 100%;
  transition: all 35s;
}

.left-to-right-enter-from{
     transform: translateX(-100vw);
}
.left-to-right-leave-to{
     transform: translateX(50vw);
}

.right-to-left-enter-from{
    transform : translateX(100vw)
}
.right-to-left-leave-to{
     transform: translateX(-50vw);
}


.left-to-right-enter-to,
.left-to-right-leave-from,
.right-to-left-enter-to,
.right-to-left-leave-from{
    opacity: 1;
    transform: translateX(0);
}



</style>
<!--
    methods:{
        test(e){
            
            this.scroll_array[this.modelValue] = e.target.scrollTop;
            console.log(this.scroll_array)
        },
        tests(){
                document.getElementsByClassName(`tab-${this.modelValue}`)[0].scrollTo(0, this.scroll_array[this.modelValue]);
        }
    },
    watch:{
        modelValue: function(newVal, oldVal){
            /*
            console.log(`tab-${oldVal} => tab-${newVal}`)
            
            this.scroll_array[oldVal] = document.getElementsByClassName(`tab-${oldVal}`)[0].scrollTop;
            console.log(`저장됨, tab-${oldVal} : ${this.scroll_array[oldVal]}`)
            

            document.getElementsByClassName(`tab-${newVal}`)[0].scrollTo(0, -1 * this.scroll_array[newVal]);
        console.log(`강제스크롤, tab-${newVal} : ${this.scroll_array[newVal]}`)
            */
        }
    }
-->