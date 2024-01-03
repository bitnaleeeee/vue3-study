
<template>
  <div ref="dropZoneRef" class="ui-file-drop-transparent-layout" :class="[isOverDropZone ? 'over' : '', props.active ? 'active' : '']">
    <div v-if="Loading" class="Loading">
      <div class="progress">
        <div class="percent" :style="`width : ${CurrentProgress / TotalProgress * 100}%`">
          {{ (CurrentProgress / TotalProgress * 100).toFixed(1) }}%
        </div>
      </div>
      <div class="Text">
        {{LoadingString}}
      </div>
    </div>
    <div v-else class="placeholder">
      <div>
        <i class='bx bx-file-blank' ></i>
      </div>
      <span>파일을 목록에 추가</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { useDropZone } from '@vueuse/core'
import { watch, ref } from 'vue'
import { dataURLtoFile } from '@/modules/@homecheck/libs/Functions/files'
// dynamically Loading
const importLoading = ref(false)
let PdfjsLib;
let pdfjsWorker;
import("pdfjs-dist").then(result =>{
  PdfjsLib = result
  import('pdfjs-dist/build/pdf.worker.entry').then(result => {
  pdfjsWorker = result
  PdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  importLoading.value = true
  });
});


const dropZoneRef = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
const emit = defineEmits(['update:modelValue', "update:active", "onWarning", "onDrop", "onAddEnded"])
const filesData = ref<File[]>([])
const props = defineProps({
  config : {
    type : Object,
    default : {
      pdfExpand : true
    }
  },
  active : Boolean
})
const Loading = ref(false)
const LoadingString= ref('')
const Warning = ref<string[]>([])
const TotalProgress = ref<Number>(1);
const CurrentProgress = ref<Number>(0)

  let loading = 0;

const dragExitDebounce = _.debounce(dragExit, 200)

function dragExit() {
  if (isOverDropZone.value == false && !Loading.value) {
    console.log("active to False")
    emit("update:active", false)
  }
}
watch(() => isOverDropZone.value, (to, from) => {
  if (to == false && !Loading.value) {
    dragExitDebounce()
  }
})
async function onDrop(files: File[] | null) {
  Loading.value = true;
  LoadingString.value= '파일을 불러오고 있습니다.'
  filesData.value = []
  Warning.value = []
  TotalProgress.value = 100;
  CurrentProgress.value = 0;

  const PDFFiles = files ? files.filter((file)=> file.type == 'application/pdf') : []
  if (files) {
    filesData.value = files.filter((file)=> ['image/png','image/jpeg','image/jpg','image/gif'].includes(file.type))
    filesData.value = filesData.value.filter((file)=> {
      if( file.size > 20097452 ) {
        Warning.value.push('20MB가 넘는 사진 파일을 올릴 수 없습니다.')
        return false
      } 
      else {
        return true
      }
    })
  }
  TotalProgress.value = filesData.value.length;
  CurrentProgress.value = 0;
  if(filesData.value.length == 0 && PDFFiles.length == 0)
  {
    Warning.value.push('지원되는 파일 형식이 없습니다.')
    Loading.value = false;
    dragExitDebounce();
    return;
  }
  else if (PDFFiles.length == 0) {
    Loading.value = false;
    dragExitDebounce();
    emit('onAddEnded', filesData.value)
    return;
  }


  for await (let file of PDFFiles) {
    const pdfBlobURL = URL.createObjectURL(file)
    let pdf = await PdfjsLib.getDocument({ url : pdfBlobURL }).promise
    TotalProgress.value = TotalProgress.value  + pdf.numPages;
    for(let i = 1; i <= pdf.numPages; i ++){

      loading++;
      const canvasId= `${withoutExtension(file)}_${i}.pdf`
      let page = await pdf.getPage(i)
      let viewport = page.getViewport({scale : 2.5})
      let canvas : HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement
      let context : CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({
        canvasContext : context,
        viewport : viewport
      }).promise

      filesData.value.push(dataURLtoFile(canvas.toDataURL('image/webp', 0.8), canvasId))

      setTimeout(() => {
        CurrentProgress.value = CurrentProgress.value + 1
      },1)
      canvas.remove()


    }


    URL.revokeObjectURL(pdfBlobURL)
  }
  dragExitDebounce();
  Loading.value = false
  emit('update:modelValue', filesData.value)
  if (Warning.value.length > 0) {
    emit('onWarning', Warning.value)
  }
  emit('onAddEnded', filesData.value)
}

function withoutExtension(file : File){
  switch(file.type){
    case 'image/gif' :
    case 'image/png' :
    case 'image/webp' :
    case 'application/pdf' :
      return file.name.slice(0, file.name.length - 4)
    case 'image/jpeg' :
    case 'image/jpg' :
      return file.name.includes('.jpeg') ? file.name.slice(0, file.name.length - 5) : file.name.slice(0, file.name.length - 4)
  }
}

</script>
<style scoped>
.ui-file-drop-transparent-layout {
  position: absolute;
  width : 100%;
  height: 100%;
  pointer-events: none;
  background: #f2f5f900;
  transition: all 0.22s ease;
  height: 100%;
  padding: 6px;
}

.ui-file-drop-transparent-layout.active {
  pointer-events: all;
}
.ui-file-drop-transparent-layout.active,
.ui-file-drop-transparent-layout.over {
  background: #f2f5f9db;
}

.ui-file-drop-transparent-layout.over .placeholder {
  opacity: 1;
}
.ui-file-grid{
  display: grid;
  grid-gap: 6px;
  overflow : auto;
}
.ui-file-grid-item{
  display: flex;
  position:relative;
  flex-direction: column;
  gap : 6px;
  border-radius: var(--radius);
  align-items: center;
  padding: 6px 0;
  user-select: none;
transition: all 0.22s ease;
}

.ui-file-grid-item > img{
transition: all 0.22s ease;
}

.ui-file-grid-item .btns{
  display: none;
  position:absolute;
  z-index: 5;
}
.ui-file-grid-item:hover .btns{
display:flex;
top:50%;
}
.ui-file-grid-item img {
  width : 80%;
  user-select: none;
  pointer-events: none;
  object-fit: contain;
}
.ui-file-grid-item .preview {
  display:flex;
  justify-content:center
}

.placeholder{
  font-size: 24px;
  font-weight: 500;
  position: absolute;
  left :50%;
  top: 50%;
  color: #999;
  user-select: none;
  text-align: center;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.placeholder  i {
  font-size: 2.5rem;
  padding-bottom: 1rem;
}

.Loading {
  position : absolute;
  top: 0;
  width : 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  user-select: none;
}

.Loading .Text{
  display: flex;
  flex-direction: column;
  gap : 8px;
  align-items:center;
}

.Loading .progress {
  background: transparent;
  width : 200px;
  height: 16px;
  border-radius: 0.3rem;
  display: flex;
  overflow: hidden;
  margin-bottom: 1rem;
}
.Loading .progress .percent {
  background: #0064FF;
  height: 100%;
  color : #fff;
  font-size: 0.8rem;
  border-radius: 0.3rem;
  font-weight: 400;
  text-align: center;
}

</style>
