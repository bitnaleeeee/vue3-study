<template>
  <div class="env-layout">
    <br />
    <ul class="callout" style="margin: 0 1.2rem">
      <li>환경 사진은 <b>건물별로 별도</b>로 저장됩니다.</li>
    </ul>
    <br />
    <template v-for="(name, key) in FixedEnvironmentString" :key="key">
      <div class="column">
        <h4>{{ name }}</h4>
        <BrowserCamera v-if="!props.isCameraActive" @onFileAdded="(file)=> onAddItem(file,key)" >추가하기</BrowserCamera>
      </div>
      <section>
        <div v-if="getEnvironmentItemByKey(key).getImgs().length == 0" class="placeholder">표시할 항목이 없습니다.</div>
        <div class="img-items">
          <div v-for="(img, i) of getEnvironmentItemByKey(key).getImgs()" :key="i" class="item"
          
          @click="onEnvironmentImageClicked(img)"
          >
            <AsyncImg @error="onImageLoadFailed" :source="props.imgPattern(img.url)" />
          </div>
        </div>
      </section>
      <br />
    </template>
  </div>
</template>
<script setup>
//CaptureEnvironment
import { FixedEnvironmentString } from "@/modules/@homecheck-safetydiagnosis/models/values/static";

const props = defineProps({
  imgPattern: Function,
  getEnvironmentItemByKey: Function,
  isCameraActive: Boolean,
});

const emits = defineEmits(["onImageLoadFailed", "onAddItem", "onEnvironmentImageClicked"]);

function onImageLoadFailed(e) {
  emits("onImageLoadFailed", e);
}
function onEnvironmentImageClicked(img) {
  emits("onEnvironmentImageClicked", img);
}

function onAddItem(file, key) {
  emits("onAddItem", {
    file,
    key
  });
}
</script>
<style scoped>
.img-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 0.5rem;
  padding-top: 0.5rem;
  overflow: auto;
  box-sizing: border-box;
}
.img-items > .item {
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 1 / 1;
}
.img-items > .item > img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.env-layout {
  height: 100%;
  overflow: auto;
}

.env-layout > section {
  background: #f9fafc;
  border-radius: var(--radius);
  margin: 0 1.2rem;
  padding: 0.3rem 0.6rem;
}
.env-layout > section > .placeholder {
  font-weight: 700;
  color: #bbb;
  text-align: center;
  padding: 0.4rem 0;
  font-size: 0.8rem;
}
.column {
  margin: 0.4rem 1.2rem;
}
</style>
