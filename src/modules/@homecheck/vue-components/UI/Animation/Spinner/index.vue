<template>
<div class="controller" :class="[size]">
  <div class="loader-box">
    <span class="loader1"></span>
    <span class="loader2"></span>
    <span class="loader3"></span>
  </div>
</div>
</template>
<script>
export default{
    props:["size"]
}</script>
<style scoped>

*{
 box-sizing: border-box;
}
.controller{
    width: 24px;
    height: 24px;
}

.controller.md{
    width:36px;
    height: 36px;
}

.controller.lg{
    width:48px;
    height: 48px;
}


.loader-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
}
.loader1 , .loader2 , .loader3 {
    width: 47%;
    height: 47%;
    border-radius: 40px;
    border-color: #333;
    border-width: 2.5px;
    border-style: solid;
    display: inline-block;
    position: absolute;
    animation-duration: 10s;
    animation-iteration-count: infinite;
}
.controller.md .loader1 ,.controller.md .loader2 ,.controller.md .loader3 {
    border-width: 3px;
}
.controller.lg .loader1 ,.controller.lg .loader2 ,.controller.lg .loader3 {
    border-width: 6px;
}


/*
.controller.black .loader-box span{
    border:  2px solid #fff;    
}*/


.loader1 {
    border-color:var(--primary) !important;
    animation-name: loader1;
    top: 0;
    left: 0;
}
.loader2 {
    animation-name: loader2;
    top: 0;
    left: 53%;
}
.loader3 {
    animation-name: loader3;
    top: 53%;
    left: 0;
}







@keyframes loader1 {
    0% {
        width: 47%;
        height: 47%;
    }
    12.48% {
        width: 47%;
        height: 47%;
    }
    16.64% {
        width: 100%;
        height: 47%;
        left: 0;
        right:auto;
    }
    16.70% {
        left: auto;
        right:0;
    }
    20.8% {
        width: 47%;
        height: 47%;
    }
    37.44% {
        width: 47%;
        height: 47%;
    }
    41.6% {
        width: 47%;
        height: 100%;
        top: 0;
        bottom: auto;
    }
    41.8% {
        top: auto;
        bottom: 0;
    }
    45.76% {
        width: 47%;
        height: 47%;
    }
    62.4% {
        width: 47%;
        height: 47%;
    }
    66.56% {
        width: 100%;
        height: 47%;
        left: auto;
        right:0;
    }
    66.60% {
        left: 0;
        right:auto;
    }
    70.72% {
        width: 47%;
        height: 47%;
    }
    87.36% {
        width: 47%;
        height: 47%;
    }
    91.52% {
        width: 47%;
        height: 100%;
        top: auto;
        bottom: 0;
    }
    91.57% {
        top: 0;
        bottom: auto;
    }
    95.68% {
        width: 47%;
        height: 47%;
    }
    100% {
        width: 47%;
        height: 47%;
    }
}
@keyframes loader2 {
    0% {
        width: 47%;
        height: 47%;
    }
    4.16% {
        width: 47%;
        height: 47%;
    }
    8.32% {
        width: 47%;
        height: 100%;
        top: 0;
        bottom: auto;
    }
    8.40% {
        top: auto;
        bottom: 0;
    }
    12.48% {
        width: 47%;
        height: 47%;
    }
    29.12% {
        width: 47%;
        height: 47%;
    }
    33.28% {
        width: 100%;
        height: 47%;
        right: 0;
        left: auto;
    }
    33.35% {
        left: 0;
        right: auto;
    }
    37.44% {
        width: 47%;
        height: 47%;
    }
    54.08% {
        width: 47%;
        height: 47%;
    }
    58.24% {
        width: 47%;
        height: 100%;
        top: auto;
        bottom: 0;
    }
    58.30% {
        top: 0;
        bottom: auto;
    }
    62.4% {
        width: 47%;
        height: 47%;
    }
    79.04% {
        width: 47%;
        height: 47%;
    }
    83.2% {
        width: 100%;
        height: 47%;
        left: 0;
        right: auto;
    }
    83.25% {
        left: auto;
        right: 0;
    }
    87.36% {
        width: 47%;
        height: 47%;
    }
    100% {
        width: 47%;
        height: 47%;
    }
}
@keyframes loader3 {
    0% {
        width: 100%;
        height: 47%;
    }
    4.16% {
        width: 47%;
        height: 47%;
    }
    20.8% {
        width: 47%;
        height: 47%;
    }
    24.96% {
        width: 47%;
        height: 100%;
        top: auto;
        bottom: 0;
    }
    25.05% {
        top: 0;
        bottom: auto;
    }
    29.12% {
        width: 47%;
        height: 47%;
    }
    45.76% {
        width: 47%;
        height: 47%;
    }
    49.92% {
        width: 100%;
        height: 47%;
        left: 0;
        right: auto;
    }
    49.95% {
        right: 0;
        left: auto;
    }
    54.08% {
        width: 47%;
        height: 47%;
    }
    70.72% {
        width: 47%;
        height: 47%;
    }
    74.88% {
        width: 47%;
        height: 100%;
        top: 0;
        bottom: auto;
    }
    74.92% {
        top: auto;
        bottom: 0;
    }
    79.04% {
        width: 47%;
        height: 47%;
    }
    95.68% {
        width: 47%;
        height: 47%;
    }
    100% {
        width: 100%;
        height: 47%;
        right: 0;
        left: auto;
    }
}
</style>