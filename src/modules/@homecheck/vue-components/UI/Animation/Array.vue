<template >
    <transition-group 
    appear
    :name="props.type"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    class="ui-animation-array-items ui-component"
    :id="component_id"
    >
        <slot v-if="Loaded" />
    </transition-group>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { getRandomString} from '@/modules/@homecheck/libs/min'

const props = defineProps({
  type: String,
  delay: Number,
  grid: {
    type: Boolean,
    defaults : false
  },
  always : {
    type : Boolean,
    defaults : false
  }
})
const component_id = `ui-component-${getRandomString(8,false)}`
let init = false
let currentCount = 0;
let parentElement = null
let columnCount = 1
const Loaded = ref(false)
const Delay = ref(computed(() => {
    if (props.delay != 0 && !props.delay) {
    return 0
    }
    else {
        return props.delay
    }
}))
onMounted(() => {
  if (props.grid) {
      parentElement = document.getElementById(component_id)
     const gridComputedStyle = window.getComputedStyle(parentElement)
     columnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
  }

  currentCount = 0;
  Loaded.value = true
})



function beforeEnter(el, arg) {
  if (init) return;
  
  if (props.grid) {
    if (parentElement) {
      parentElement.style.overflow = 'hidden'
      
    }
    const row = parseInt(currentCount / columnCount)
    const column = currentCount % columnCount
     el.style.transitionDelay = Delay.value + 60 * row + 60 * column + 'ms'
  }
  else {
     el.style.transitionDelay = Delay.value + 25 * currentCount + 'ms'
  }

  currentCount++

  }

function afterEnter(el, arg) {
  if (currentCount == el.parentElement.children.length && !init) {
    init = true
    if (props.grid && parentElement) {
      parentElement.style.removeProperty('overflow')
    }
    if(props.always){
      init = false;
      currentCount = 0;
    }
  }
  el.style.transitionDelay = ''
}

</script>