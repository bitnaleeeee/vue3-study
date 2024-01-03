<template>
    <div class="container">
        <div class="progress">
            <span class="title timer" data-from="0" :data-to="props.modelValue" data-speed="1800">{{ props.modelValue }}</span>
            <div class="overlay"></div>
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </div>
</template>
<script setup>

const props = defineProps({
    modelValue : Number
})
</script>
<style scoped>
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0
}

.container {
}

.progress {
    width: 85px;
    height: 85px;
    font-size: 1rem;
    color: #0f0f0f;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    text-align: center;
    line-height: 85px;
}

.progress::after {content: "%";}

.progress .title {position: relative;z-index: 100;}

.progress .overlay {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.progress .left, .progress .right {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: 10px solid #222235;
    border-radius: 100px 0px 0px 100px;
    border-right: 0;
    transform-origin: right;
}

.progress .left {animation: load1 1s linear forwards;}

.progress:nth-of-type(2) .right, 
.progress:nth-of-type(3) .right {animation: load2 .5s linear forwards 1s;}

.progress:last-of-type .right, 
.progress:first-of-type .right {animation: load3 .8s linear forwards 1s;}

@keyframes load1 {
    0% {transform: rotate(0deg);}

    100% {transform: rotate(180deg);}
}

@keyframes load2 {
    0% {z-index: 100;transform: rotate(180deg);}

    100% {z-index: 100;transform: rotate(270deg);}
}

@keyframes load3 {
    0% {z-index: 100;transform: rotate(180deg);}

    100% {
        z-index: 100;transform: rotate(315deg);}
}
</style>