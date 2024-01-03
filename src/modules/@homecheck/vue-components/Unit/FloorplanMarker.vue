<template>
  <Drop @drop="onDrop" class="dropzone">
    <div id="panView" ref="panView" class="unit-floorplan-marker-layout floorplan-view">
      <AsyncImg ref="floorplanElement"
        @load="floorplanLoaded"
        :style="`transform: rotate(${floorplanRotate}deg);
        width : ${imgWidth}px; height : ${imgHeight}px
        
        `"
        :source="props.imgSrc"
      />

      <!-- 마커 파트-->
      <slot v-if="loaded"  />
    </div>
  </Drop>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick  } from "vue";

import "vue-slider-component/theme/default.css";
import Panzoom from "@panzoom/panzoom";
import type { PanzoomObject } from "@panzoom/panzoom";
import {  Drop  } from "vue-easy-dnd";
import _ from "lodash";

const props = defineProps({
    calibrateY : {
        default : 0,
        type : Number
    },
    imgSrc : {
        default : "",
        type :  [Promise<String> , String]
  },
  imgWidth: {
    default: 'auto',
      type : [String, Number]
    },
  imgHeight: {
    default: 'auto',
      type : [String, Number]
    },
    forceLock : {
        default : false,
        type : Boolean
    },
    blockDropToOutside : {
        default : true,
        type : Boolean
    }
})

const emits = defineEmits(["onTouchWithForceLock", "onLoaded"])

const eventList = {
    onHandleStart : (e : PointerEvent)=> {},
    onTouchMove: (e : TouchEvent, el : PanzoomObject)=>{},
    onDrop : (e : any, path : { x: number, y: number })=>{}
}


const floorplanRotate = ref<number>(0);

//UI Controll

// UI Component
const panzoom = ref<PanzoomObject>(null);
const panView = ref<HTMLElement>(null);

const floorplanElement = ref<HTMLImageElement>(null)
const floorplanCenter = ref({
    x : 0,
    y : 0
});
const loaded = ref(false);


onMounted(() => {
  nextTick(() => {
    panzoom.value = Panzoom(panView.value, {
      maxScale: 3,
      minScale: 0.2,
      animate: true,
      handleStartEvent: (e: PointerEvent) => {
        if (props.forceLock) {
          emits("onTouchWithForceLock", true)
        }
        eventList.onHandleStart(e)
      },
    });
    
    (panView.value as HTMLElement).addEventListener("touchmove", (e : TouchEvent) => {
        eventList.onTouchMove(e, panzoom)
      }, false );
  });
});



/*
watch(
  () => floorplanRotate.value,
  (to, from) => {
    document.querySelector(":root").style.setProperty("--floorplanRotate", `${to}deg`);
  }
);
*/

function addEventListener(eventName : string, action : ()=> void){
    eventList[eventName] = action
}


function centerize() {
  panzoom.value.pan(0, 0);
}


function changeDraggable(value: boolean) {
  panzoom.value.setOptions({
    disablePan: value,
    disableZoom: value,
  });
}

function floorplanLoaded() {
  nextTick(() => {
    if(!props.imgSrc) return;
    if(!loaded.value){
        emits("onLoaded", true)
    }
    loaded.value = true;
    const rect = floorplanElement.value!.imgElement.getBoundingClientRect();
    floorplanCenter.value = {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  });
}

function onDrop(e: any) {
  const floorplanRect = floorplanElement.value!.imgElement.getBoundingClientRect();
  const Rect = panView.value!.getBoundingClientRect();

  // 범위를 밖으로 벗어나는 경우
  if (
    props.blockDropToOutside &&
    e.position.y < Rect.y || floorplanRect.y * -1 + e.position.y > floorplanRect.height || floorplanRect.x * -1 + e.position.x > floorplanRect.width || floorplanRect.x * -1 + e.position.x < 0)
    return;


  var scale = panzoom.value.getScale();
  var calibratedX = Rect.x * -1;
  var calibratedY = Rect.y * -1;
  var x = (calibratedX + e.position.x) / scale; // - (this.panzoom.getPan().x / 1)
  var y = (calibratedY + e.position.y) / scale - props.calibrateY / scale; //- (10 + (15 / scale))// - (this.panzoom.getPan().y / 1)
  var _x = reversePath(x, y, floorplanCenter.value.x, floorplanCenter.value.y, "x");
  var _y = reversePath(x, y, floorplanCenter.value.x, floorplanCenter.value.y, "y");


eventList.onDrop(e, {
    x : _x,
    y : _y
})

}

function reversePath(x: number, y: number, offsetX: number, offsetY: number, property: string){
  const rotate = 0;
  const radian = (360 - rotate) * (Math.PI / 180) * -1;
  const parsefloat = (val : string | number) : number =>{
    return parseFloat(`${val}`)
  }
  //mx
  let XPath = x - offsetX;
  let YPath = y - offsetY;
  // DestX

  switch (property) {
    case "x":
      let DestX = parsefloat(XPath) * parsefloat(Math.cos(radian)) + parsefloat(YPath) * parsefloat(Math.sin(radian));
      return parsefloat(DestX) + parsefloat(offsetX);
    default:
      let DestY = parsefloat(XPath) * parsefloat(Math.sin(radian)) * -1 + parsefloat(YPath) * parsefloat(Math.cos(radian));
      return  parsefloat(DestY) + parsefloat(offsetY);
  }
};


defineExpose({
    centerize,
    floorplanCenter,
    loaded,
    changeDraggable,
    addEventListener,
    floorplanElement
})
</script>
<style scoped>

.unit-floorplan-marker-layout {
  width: 100%;
  height: 100%;
  overflow: visible;
}

#floorplanView {
  border: 1px solid #999;
  box-sizing: content-box;
  transform-origin: 50% 50%;
}

.dropzone {
  transition: 0.22s ease all;
  height: 100%;

  background: linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%), linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%);
  background-color: #eaeaea;
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
}

.dropzone::before {
  /* Added */
  content: "";
  position: absolute;
  transition: 0.22s ease all;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /*
        background: #eaeaea;*/
  background: linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%), linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%);
  background-color: #eaeaea;
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
}
</style>
