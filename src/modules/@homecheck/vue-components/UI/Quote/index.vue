<template>
<div class="d-f blockquote" style="font-size:1.5rem;">
            <i class='bx bxs-quote-alt-left'></i>
            <div>
            <slot/>
        </div>
            <i class='bx bxs-quote-alt-right'></i>
    </div>
</template>
<style scoped>
    .blockquote{
        font-size: 1.5rem;
        flex-direction: column;
    }

    .blockquote .bxs-quote-alt-right{
        align-self : flex-end;
    }
</style>