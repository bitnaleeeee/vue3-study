
<template>
  <div style="position:relative">
  <div @contextmenu.prevent="Context" ref="dropZoneRef" class="ui-file-drop" :class="[isOverDropZone ? 'active' : '']">
    <div style="width:100%; height: 20px;">

</div>

    <div v-if="filesData.length > 0" class="ui-file-grid"
          :style="`grid-template-columns : repeat(auto-fill, minmax(${props.config.previewSize}px, 1fr));`">
          <div v-for="(file, index) in filesData" :key="index" class="ui-file-grid-item">
             <div class="btns" v-if="props.config.rotate"> 
                <UIButton type="white" size="sm" @click="rotateFile(index,90)"><i class="bx bx-rotate-right" style="font-size:14px;"></i></UIButton>
                <UIButton type="white" size="sm" @click="rotateFile(index,270)"><i class="bx bx-rotate-left" style="font-size:14px;"></i></UIButton>
             </div>
            <img
            style="flex:1" 
            :src="toURL(file)"
            :class="[toExtension(file.type)]"/>
           
            <p style="word-break : break-all; margin: 0;width:100%;text-align:center;">{{withoutExtension(file)}}</p>
          </div>
        </div>
        <div v-else class="placeholder">
          <span>{{ isOverDropZone ? '파일들 목록에 추가' : '이 위에 파일을 올려주세요.' }}</span>
        </div>
  </div>
  <div v-show="false" style="transform : scale(0.3)">
    <canvas v-for="pdf in PDFFiles" :key="pdf" :id="pdf"/>
    <canvas v-for="file in filesData" :key="file" :id="file.name"/>
    <canvas v-for="file in filesData" :key="file" :id="`${file.name}_rotate`"/>
  </div>
  <div v-if="Loading" class="Loading">
    <div class="Text">
      <UIAnimationSpinner/>
      {{LoadingString}}
    </div>
  </div>
  <UICard v-if="Warning.length > 0">
    <ul>
      <li v-for="message in Warning" :key="message">{{ message }}</li>
    </ul>
  </UICard>
</div>
</template>
<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import ContextMenu from '@imengyu/vue3-context-menu'

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
const emit = defineEmits(['update:modelValue'])
const filesData = ref<File[]>([])

const PDFFiles =  ref<string[]>([])
const props = defineProps({
  config : {
    type : Object,
    default : {
      previewSize : 120,
      preview : true,
      pdfExpand : false,
      rotate : false
    }
  }
})
const Loading = ref(false)
const LoadingString= ref('')
const Warning = ref<string[]>([])

  let loading = 0;


async function onDrop(files: File[] | null) {
  LoadingString.value= '파일을 불러오고 있습니다.'
  filesData.value = []
  PDFFiles.value = []
  Warning.value = []
  Loading.value = true;
  let pdfFiles : File[] = []
  if (files) {
    filesData.value = files.filter((file)=> ['image/png','image/jpeg','image/jpg','image/gif'].includes(file.type))
    filesData.value = filesData.value.filter((file)=> {
      if( file.size > 20097452 ) {
        Warning.value.push('20MB가 넘는 파일을 올릴 수 없습니다.')
        return false
      } 
      else {
        return true
      }
    })
    
    pdfFiles = files.filter((file)=> file.type == 'application/pdf')
  }

if(filesData.value.length == 0 && pdfFiles.length == 0)
  {
    Warning.value.push('지원되는 파일 형식이 없습니다.')
    Loading.value = false;
    return;
  }

  if(pdfFiles.length == 0){
    Loading.value = false;
  }
  for await(let file of pdfFiles){
    let pdf = await PdfjsLib.getDocument({ url : URL.createObjectURL(file) }).promise
      if(props.config.pdfExpand){
        for(let i = 1; i <= pdf.numPages; i ++){

        loading++;
          const canvasId= `${withoutExtension(file)}_${i}.pdf`
          PDFFiles.value.push(canvasId)
          let page = await pdf.getPage(i)
          //.then((page)=>{
        let viewport = page.getViewport({scale : 2.5})
        let canvas : HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement
        let context : CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;


        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({
          canvasContext : context,
          viewport : viewport
        }).promise
         filesData.value.push(dataURLtoFile(canvas.toDataURL('image/webp',0.8), canvasId))
        }
      }
      else
      {
        loading++;
          const canvasId= `${withoutExtension(file)}.pdf`
          PDFFiles.value.push(canvasId)
        let page = await pdf.getPage(1)
        //.then((page)=>{
        let viewport = page.getViewport({scale : 2.5})
        let canvas : HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement
        let context : CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({
          canvasContext : context,
          viewport : viewport
        }).promise
         filesData.value.push(dataURLtoFile(canvas.toDataURL('image/webp',0.8), canvasId))
      }
    
  }
  Loading.value = false
  emit('update:modelValue', filesData.value)
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

function toURL(file : File){
  if(!props.config.preview){
    return '';
  }
  return URL.createObjectURL(file)
}

function toExtension(type : String){
  if(props.config.preview){
    return ''
  }
  switch(type)
  {
    case 'image/png' :
      return 'img-png'
    case 'image/jpeg' :
    case 'image/jpg' :
      return 'img-jpg'
    case 'image/gif' :
      return 'img-gif'
    case 'application/pdf' :
      return 'img-pdf'
    default :
    return type;
  }
}

function Context(e : PointerEvent){
        e.preventDefault();
        //https://imengyu.top/pages/vue3-context-menu-docs/en/api/ContextMenuInstance.html
    ContextMenu.showContextMenu({
      x: e.x,
      y: e.y,
      customClass : 'ui-context',
      items: [
        { 
          label: `파일 목록 초기화`, 
          onClick: () => {
            filesData.value = [];
             emit('update:modelValue', filesData.value)
          }
        }
      ]
    });
}

function rotateFile(index : number, degree : number){
  if(Loading.value) return;
  Loading.value = true
  LoadingString.value= '파일을 변환하고 있습니다.'

  const img : HTMLImageElement = new Image();
  img.src =URL.createObjectURL(filesData.value[index])


    const canvasId= `${filesData.value[index].name}`
    const canvas : HTMLCanvasElement = document.getElementById(`${canvasId}`) as HTMLCanvasElement
    const context : CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;


    //draw the image
    img.onload = function (){
        canvas.width = (degree == 90 || degree == 270) ? img.height : img.width
        canvas.height = (degree == 90 || degree == 270) ? img.width : img.height
        context.translate(0 + canvas.width / 2, 0 + canvas.height / 2);
        context.rotate(degree * Math.PI / 180);
        context.drawImage(img, img.width / 2 * (-1), img.height / 2 * (-1), img.width,  img.height);
        context.save()
        //console.log(canvas.toDataURL('image/webp',0.8))
        filesData.value.splice(index, 1, dataURLtoFile(canvas.toDataURL('image/webp',0.8), canvasId))
        Loading.value = false
    }
}



defineExpose({
  rotateFile
})



function dataURLtoFile(base64 : string, fileName : string){
  let arr : string[] = base64.split(',') as string[]
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
            
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, {type:mime});
}
</script>
<style scoped>

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
.img-gif{
  max-height: 30px;
        content: url('@/assets/img/gif.png')
}
.img-jpg{
  max-height: 30px;
        content: url('@/assets/img/jpg.png')
}
.img-pdf{
  max-height: 30px;
        content: url('@/assets/img/pdf.png')
}
.img-png{
  max-height: 30px;
        content: url('@/assets/img/png.png')
}

.placeholder{
  font-size: 24px;
  font-weight: 500;
  position: absolute;
  left :50%;
  top: 50%;
  color: #999;
  user-select: none;
  transform: translate(-50%, -50%);
}
.ui-file-drop{
  min-height:180px;
  max-height: 400px;
  overflow-y: auto;
  position: relative;
  background:var(--background-input); 
  border: var(--border-input);
  transition: all 0.22s ease;
  padding: 6px;
}
.ui-file-drop.active{
  border-color: var(--primary);
}

.Loading {
  position : absolute;
  top: 0;
  background: rgb(255,255,255);
  width : 100%;
  height: 100%;
  display: flex;
  justify-content:center;
  align-items: center;
}

.Loading .Text{
  display: flex;
  flex-direction: column;
  gap : 8px;
  align-items:center;
}

</style>
