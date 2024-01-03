<template>
<div v-for="(sorted , si ) of getprops" :key="si">
    <h3>{{sorted.title}}</h3>
    <div style="margin: 12px 0px; display: grid; grid-template-columns: repeat(auto-fill,minmax(130px,1fr)); grid-gap: 12px;">
        <div v-for="(item,ii) in sorted.array" :key="ii" class="img-item" @click="openExpand(item)">
            <img :src="imgThumnail(item)">
            {{item}}
            <div>
                <span style="vertical-align: sub; color: #444;">
                    <span style="color: #222; font-size: 15px; font-weight:500">{{ThumnailDescription(item)}}</span>
                <br>
                <span style="font-size: 13.5px;">{{ThumnailDescription(item)}}</span></span>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
const props = defineProps({
  getprops: Object | Array
})

function keyToArray(array){
    return Object.keys(array).map((key)=>{
        return array[key]
    })
}


function imgThumnail(item){
    let inputs = keyToArray(item.inputs)
    switch(inputs[0].type){
        case 'standard':
        return `https://homecheck.kr/cdn/?f=${inputs[0].far}`;
    }
}
function ThumnailDescription(item){
    let inputs = keyToArray(item.inputs)
    return inputs[0].description
}

function openExpand(config){
    useUI().overlay.drawer.open({
    title : '사진 상세보기',
    size : 'large',
    type : 'image',
    props : config
})
}


</script>
<style scoped>
    .img-item{
        padding: 5px;
        border-radius: var(--radius);
        transition: all 0.3s ease ;
        cursor:pointer;
    }
    .img-item:hover{
        background: #f8f9fa;
    }
    .img-item img{
        width: 100%; height: 100px; object-fit: cover;
        border-radius: var(--radius);
        border : var(--border)
    }
</style>