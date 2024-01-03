
<template>
  <div ref="dropZoneRef" class="ui-file-drop" :class="[isOverDropZone ? 'active' : '']">
        <div v-if="!thumnail" class="placeholder">
          <span>{{ isOverDropZone ? '사진 등록' : '이 위에 사진을 올려주세요.' }}</span>
        </div>
        <img v-else class="thumnail"
               
                :src="thumnail">
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDropZone } from '@vueuse/core'
import { toImgUrl} from '@/modules/@homecheck/libs'

// dynamically Loading

const dropZoneRef = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop
})
const emit = defineEmits(['update:modelValue', 'onDroppedMultiFiles', 'onDroppedNotSupported', 'onChanged'])

const props = defineProps({
  modelValue : String,
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
const thumnail = ref('')


const supportExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];


onMounted(() => {
  thumnail.value = toThumnail(props.modelValue)
})

function toThumnail(value?: string) {
  return toImgUrl(value)
}


async function onDrop(files: File[] | null) {
    if (files!.length > 1) {
        emit('onDroppedMultiFiles', files!.length)
        return;
    }

    const ImageFile = files![0]

    if (!supportExtensions.includes(ImageFile.type)) {
        emit('onDroppedNotSupported', ImageFile.type)
        console.log('지원하지 않는 형식입니다.')
        return; 
    }

    const reader = new FileReader();

    reader.onload = async function (event) {
       thumnail.value = event.target.result
        emit('update:modelValue', thumnail.value)
        emit('onChanged', thumnail.value)
    };

    reader.readAsDataURL(ImageFile);

    return;
}







</script>
<style scoped>

.thumnail { 
    user-select: none; 
    width :100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
}
.placeholder{
  font-size: 1.1rem;
  font-weight: 500;
  position: absolute;
  left :50%;
  top: 50%;
  color: #999;
  text-align: center;
  user-select: none;
  width: 100%;
  letter-spacing: -1px;
  transform: translate(-50%, -50%);
}
.ui-file-drop{
  position: relative;
  background:var(--background-input); 
  border: var(--border-input);
  transition: all 0.22s ease;
  padding: 6px;
  height : 100%;
  width : 100%;
  box-sizing: border-box;
  display: flex;
}
.ui-file-drop.active{
  border-color: var(--primary);
}


</style>
