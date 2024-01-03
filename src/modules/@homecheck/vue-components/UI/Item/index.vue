<template>
    <div class="item" :class="props.active ? 'active' : ''">
            <i class='bx' :class="props.icon"
            ></i>
             <div class="body">
                <div class="label">
                    {{props.label}}
                </div>
                <span class="description">
                    {{props.description}}
                </span>
             </div>
    </div>
</template>
<script setup>
const props = defineProps({
    icon : String,
    label : String,
    description : String,
    active : Boolean
})
</script>
<style scoped>
.item {
    padding : 0.6rem 1rem;
    border-radius: var(--radius);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap : 1rem;
    color : #666;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
}
.description {
    color : #6b7684;
    font-size: 0.7rem;
}
.body {
    display: flex;
    flex-direction: column;
}
.item  .label {
    color : #666;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: pre;
}



.item.active,
.item:hover{
    background: rgb(242, 245, 249);
}
</style>