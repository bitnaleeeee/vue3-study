<template>
    <div class="placeholder">
        <span>
        {{ text}}
        </span>
    </div>
</template>
<script>
export default{
    props :{
    text:{
        type : String,
    default : '표시할 항목이 없습니다.'
    }
}
}

</script>
<style scoped>
.placeholder{
    text-align: center;
    min-height: 75px;
    align-items: center;
    display: flex;
    justify-content: center;
}
.placeholder span{
    font-size: 20px;
    font-weight: 500;
    color : #c2c2c2;
}
</style>