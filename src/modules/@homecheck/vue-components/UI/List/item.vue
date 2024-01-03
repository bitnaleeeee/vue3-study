<template>
<div class="list-item">
    <div class="list-item-img" >
        <img v-if="computedImgs.length > 0" @touchstart="img_active = true" @touchend="img_active = false" 
        :class="[img_active ? 'active' : '']"
        src="https://homecheck.kr/cdn/?f=5ae17a17d1343c5ba47789450816290d">
        <img v-if="computedImgs.length > 1" class="secondary" src="https://homecheck.kr/cdn/?f=5ae17a17d1343c5ba47789450816290d">
        <!--<span>Caption Caption Capti</span>-->
    </div>


    <div class="list-item-description center">
        {{item.label}}
        <span>
            {{item.description}}
        </span>
    </div>
    <div class="list-item-icons d-f center">
        <UIButtonIcon 
        v-for="(action,action_id) in item.actions" :key="action_id"
        align="center" :icon="action.icon"
        @click="action.command"/>
    </div>
</div>
</template>
<script>

export default ({
    props:['item'],
    data(){
        return {
            img_active : false
        }
    },
    computed:{
        computedImgs(){
            try{
           return this.item.imgs.length > 1 ? [this.item.imgs[0],this.item.imgs[1]] : this.item.imgs
            }
            catch(ex){
                return []
            }
        }
    }
})
</script>

<style scoped>

.center{
    align-self: center;
}

.list-item{
    padding: 16px 20px;
    display: flex;
}
.list-item-icons{
    color : var(--font);
}

.list-item-description{
    display: flex;
    flex-direction: column;
    font-size: 13.5px;
    font-weight: 500;
    flex : 1;
}
.list-item-description span{
    font-size : 12px;
    font-weight: 100;
}
.list-item-img{
  position: relative;
  height: 64px;
  width: 76px;
  margin-right: 20px ;
}

.list-item-img img{
  position: absolute;
  width:64px;
  height: 100%;
  border-radius: 8px;
  border: 1px solid #a2a2a2;
  z-index : 2;
  transition: all 0.2s ease;
}
.list-item-img img.active{
  opacity: 0.8;
}
.list-item-img .secondary{
  right : 0px;
  top: 10%;
  height : 80%;
  opacity: 0.4;
  z-index: 1;
}


.list-item-img span{
  position: absolute;
  width:100%;
  bottom: 0px;
  z-index: 2;
  color:#fafafa;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13.5px;
  padding: 8px;
}


.list-item-imgss::before{
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left : 0;
  position: absolute;
  background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.95) 80%);
  border-radius: 8px;
  z-index: 1;
}

.list-item-img::after{
content: '';
display: block;
padding-bottom: 100%;
}

</style>