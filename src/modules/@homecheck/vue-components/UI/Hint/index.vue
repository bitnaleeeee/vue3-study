<template>
    <div class="hint-area" >
        <transition name="hint">
            <div v-if="(props.modelValue && props.html)" class="hint-content" v-html="props.html">
            </div>
        </transition>
        </div>
        <i v-if="props.html" style="margin-left:10px;" class='bx bx-question-mark bx-border-circle'></i>
</template>
<script setup>
const props = defineProps({
    html : String,
    modelValue : Boolean
})


</script>
<style scoped>

.bx {
    font-size: 0.5rem;
    color: var(--font-icon);
    vertical-align: middle;
    align-self:center;
}

.bx-border-circle {
    padding: .2em;
    border: .07em solid var(--font-icon)
}
.hint-area{
    position: relative;
}
.hint-content {
    position: absolute;
    user-select: none;
    top:20px;
    font-size: 14px;
    font-weight: 400;
    min-width:200px;
    max-width:400px;
    line-height: 1.6;
    background: var(--background-content);
    border-radius: var(--radius);
    border : 1px solid var(--border);
    padding : 12px 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.hint-enter-active,
.hint-leave-active{
    transition: all 0.3s ease;
}

.hint-enter-to,
.hint-leave-from {
    transform: translate(0,0);
    opacity: 1;
}
.hint-enter-from,
.hint-leave-to {
    transform: translate(0,-5px);
    opacity: 0;
}
@media (max-width:520px) {
    .hint-content{
        position : fixed;
        transform : translateY(42px);
        left : 0;
        width: calc(100% - 40px ) !important;
        top: unset;
    }
    .hint-enter-to,
.hint-leave-from {
    transform: translate(0,42px);
    opacity: 1;
}
    .hint-enter-from,
.hint-leave-to {
    transform: translate(0,35px);
    opacity: 0;
}
}

</style>