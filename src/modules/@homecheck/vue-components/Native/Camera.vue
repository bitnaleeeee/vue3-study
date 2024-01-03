<template>
  <div class="camera-layout">
    <div ref="cameraScreen" class="camera-screen"></div>
      <div class="capture-wrapper">
        <div class="capture" :class="[capture_animation ? 'active' : '']" @click="capture"
          v-on:touchstart="() => (capture_animation = true)" v-on:touchend="() => (capture_animation = false)">
          <div class="ring"></div>
          <div class="circle">
            <i class="bx bxs-camera"></i>
          </div>
        </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { cameraController } from '@/modules/@homecheck/libs/Camera'

const cameraScreen = ref<HTMLDivElement>(null)
const capture_animation = ref(false)


const emits = defineEmits(["onCapture"])
const props = defineProps({
  blockCapture : Boolean
})

onMounted(() => {
  setTimeout(()=>{
    previewStart();
  },400)
});
onUnmounted(() => {
  previewStop()
});



async function capture() {
  if (props.blockCapture) return;

  const output = await cameraController.value.capture();
  emits("onCapture", output)
}

async function previewStart() {
  cameraController.value.setRatio(Math.ceil(window.innerWidth), Math.ceil(window.innerHeight))
  cameraController.value.previewStart(cameraScreen.value)
}

async function previewStop(){
  cameraController.value.previewStop();
}


defineExpose({
  capture,
  previewStart,
  previewStop
})

/**
 * 
 * async function capture(width=2048, height=1536) {
  let capture_data = await NativeCamera.capture({
    width: width,
    height: height,
  });
  // only Android
  return {
    extension: "webp",
    base64: capture_data.value,
  };
}



 */

  /*
            new Promise(async function (resolve, reject) {
                //width , height 조정되어야함.
                let capture_data = await NativeCamera.capture({
                    width: 2048,
                    height: 1536,
                });
                // only Android
                resolve({
                    extension : 'webp',
                    base64 : capture_data.value
                });
            })
            
            */

</script>
<style scoped>
.camera-layout {
  display: flex;
  flex-direction: column;
  flex:1;
}
.camera-screen {
  flex: 1;
  background: #000;
}







.camera-layout .capture {
  width: 70px;
  height: 70px;
  transform: translate(0%);
  position: inherit;
}

.circle {
  position: absolute;
  top: 12%;
  left: 12%;
  bottom: 12%;
  right: 12%;
  border-radius: 100%;
  /*background-color: #666;*/
  background-color: #fff;
  opacity: 1;
  font-size: 24px;
  display: flex;
  align-items: center;
  place-content: center;
  color: #fff;
}

.ring {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  border-radius: 100%;
  border: 0.35em solid #ddd;
  opacity: 0.8;
}

.camera-layout .capture .circle i {
  display: none;
  opacity: 1;
}


.camera-layout .capture-wrapper {
  background: black;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.camera-layout .capture .circle,
.camera-layout .capture .ring {
  transition: all 0.25s;
}

.camera-layout .capture.active .ring {
  opacity: 1;
}

.camera-layout .capture.active .circle {
  opacity: 0.5;
}
</style>
