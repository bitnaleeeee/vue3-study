<template>
<span class="metal-tag" :class="props.type">
    <slot/>
</span>
</template>
<script setup>
const props = defineProps({
    type : String
})
</script>
<style scoped>
/*
https://www.conic.style/
https://webkul.github.io/coolhue/?2.0
https://gradients.shecodes.io/gradients/31
https://www.eggradients.com/category/black-gradient
*/
.metal-tag{
    padding: 0.12rem 0.4rem;
  text-align: center;
  font-size: 0.7rem;
  color: #333;
  font-weight: 500;
 
  border-radius: var(--radius);
  /*   outline-color: transparent; */
  transition: all 0.2s ease;
  user-select: none;
}


.admin {
    color : #fff;

background-image: linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%);
}
.general2 {
    color : #fff;
background-image: linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%);
}
.general {
    color : #fff;
    background: radial-gradient(circle at 10% 20%, rgb(87, 108, 117) 0%, rgb(37, 50, 55) 100.2%);
}

.silver {
    color :#fff;
    background:  conic-gradient(from -90deg at top left, black, white);
}
.lite-silver{
    color : #666;
    background: conic-gradient(at top right, slategray, white);
}
.gold {
    background: conic-gradient(from .5turn at 50% 110%, rgb(255, 218, 34), orange);
}
.lite-gold {
    background: conic-gradient(from .5turn at 50% 110%, white, orange);
}
.admin2 {
background-color: #f06543;
background-image: linear-gradient(315deg, #f06543 0%, #ffbe3d 74%);

}
</style>