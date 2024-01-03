<template>
<div class="main-header">
        <div class="title">
            <img class="icon-logo"/>
               
            <h1>SafeCheck</h1>
        </div>
        <div style="flex:1"></div>
        <!--
            <div class="notification">
                <i class='bx bx-bell'></i>
            </div>
            <div class="notification">
                <i class='bx bx-user'></i>
            </div>
            -->
        </div>
</template>
<style scoped>
.main-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d4dada;
    padding : 0.3rem 0.8rem;
}

.main-header .title{
    display: flex;
    gap : 5px;
    align-items: center;
    color : #585858;
    font-size: 0.6rem;
}

.main-header .title > img{
    height: 1.25rem;
}
.main-header .title > h1 {
    font-size: 0.9rem;
}

.main-header .notification{
    font-size: 1.5rem;
    margin : 0 0.75rem;
    color: #aaa;
}

</style>