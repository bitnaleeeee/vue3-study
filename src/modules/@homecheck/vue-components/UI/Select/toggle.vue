<template>
<div v-wave class="toggle-item">
        <div>{{ props.label }}</div>
        <i class='bx bx-transfer' ></i>
    </div>
</template>
<script setup>
const props = defineProps({
    label : String
})

</script>
<style scoped>
.toggle-item{
    padding : 0.4rem 0.8rem;
    border-radius: var(--radius);
    border : 1px solid #d4dada;
    display: flex;
    align-items: center;
     gap : 0.5rem;
     transition: all 0.2s ease;
     justify-content: end;
}
</style>