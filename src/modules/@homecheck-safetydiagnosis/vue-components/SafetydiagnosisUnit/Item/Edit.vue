<template>
  <UIStep :index="props.step" :animation="props.animation">
    <template #1>
      <div class="header-body-layout">
        <div v-if="!exceptHeader" class="item-view-column common-padding header">
          <h3 style="flex: 1">
            {{ props.selectedItem.getTitleString() }} 항목
            <div class="created"><i class="fi fi-sr-clock"></i>{{ props.selectedItem.createdString() }}에 생성됨</div>
          </h3>
          <UIButton type="black-out circle" size="md" @click="onDeleteItem" v-wave>삭제 </UIButton>
        </div>
        <SafetydiagnosisUnitItemCommon
          :selectedItem="props.selectedItem"
          :isPrevious="props.isPrevious"
          :projects="props.projects"
          :currentProjectId="props.currentProjectId"
          :projectCheatsheet="props.projectCheatsheet"
        />
        <div class="value-list-layout">
          <div class="seperator">
            <h3>포함된 항목</h3>
            <UIButton type="black circle" size="sm" @click="onAddValue">추가하기</UIButton>
          </div>
          <div class="value-items">
            <div v-wave="{ color: '#ddd' }" @click="onEnterValue(__value)" v-for="(__value, i) in props.selectedItem.getValues()" :key="i" class="value-item">
              <div class="label">
                <div class="tag">{{ __value.getTypeString() }}</div>
                <div class="name">{{ __value.getName() }}</div>
                <div class="value-string">{{ __value.getValueString() }}, {{ __value.getQuantity() }}ea</div>
              </div>
              <div class="imgs-count">
                <i class="fi fi-sr-camera"></i>
                {{ __value.getImgs().length }} 건
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #2>
      <div class="header-body-layout">
        <div v-if="!exceptHeader" class="item-view-column common-padding header">
          <i @click="onExitValue" style="font-size: 1.75rem; padding-right: 1rem; color: #666" class="bx bx-left-arrow-alt"></i>
          <h3 style="flex: 1">
            {{ props.selectedValue.getName() ? props.selectedValue.getName() : "지정되지 않음" }}
            <span v-if="props.selectedValue.isInspections" class="silver-tag">상태평가 항목</span>

            <div class="created"><i class="fi fi-sr-clock"></i>{{ props.selectedItem.createdString() }}에 생성됨</div>
          </h3>
          <UIButton type="black-out circle" size="md" @click="onDeleteValue" v-wave>삭제</UIButton>
        </div>
        <SafetydiagnosisUnitItemValue
          v-model:selectedItem="props.selectedItem"
          v-model:selectedValue="props.selectedValue"
          :isNewValue="props.isNewValue"
          :isPrevious="props.isPrevious"
          :settings="props.settings"
          :imgPattern="props.imgPattern"
          :isInspectionProject="props.isInspectionProject"
          @onValueImageClicked="onValueImageClicked"
          @onValueImageAdd="onValueImageAdd"
          @onValueImageLoadFailed="onValueImageLoadFailed"
          @onValueUpdate="onValueUpdate"
        />
      </div>
    </template>
  </UIStep>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";

const props = defineProps({
  imgPattern: Function,
  exceptHeader: {
    default: false,
    type : Boolean
  },
  step: {
    default: 0,
    type: Number,
  },
  selectedItem: {
    default: null,
    type: Object,
  },
  selectedValue: {
    default: null,
    type: Object,
  },
  settings: {
    default: {},
    type: Object,
  },
  isPrevious: {
    default: false,
    type: Boolean,
  },
  isNewValue: {
    default: false,
    type: Boolean,
  },
  isInspectionProject: {
    default: false,
    type: Boolean,
  },
  projects: {
    default: [],
    type: Array,
  },
  currentProjectId: {
    default: "",
    type: String,
  },
  projectCheatsheet: {
    default: {},
    type: Object,
  },
  animation: {
    default: true,
    type : Boolean
  }
});

const emits = defineEmits([
  "update:selectedValue",
  "onDeleteItem",
  "onEnterValue",
  "onExitValue",
  "onDeleteValue",
  "onAddValue",
  "onValueImageClicked",
  "onValueImageAdd",
  "onValueImageLoadFailed",
  "onValueUpdate",
]);

function onDeleteItem() {
  emits("onDeleteItem", true);
}

function onEnterValue(value) {
  emits("onEnterValue", value);
}

function onExitValue() {
  emits("onExitValue", false);
}

function onDeleteValue() {
  emits("onDeleteValue", true);
}
function onAddValue() {
  emits("onAddValue", true);
}

function onValueImageLoadFailed(e) {
  emits("onValueImageLoadFailed", e);
}

function onValueImageClicked(img) {
  emits("onValueImageClicked", img);
}

function onValueImageAdd(file) {
  emits("onValueImageAdd", file);
}

function onValueUpdate(val) {
  emits("onValueUpdate", val);
}
</script>
<style scoped>
.silver-tag {
  margin-right: 5px;
  font-size: 0.5rem;
  border: 1px solid #f0f0f0;
  padding: 0.12rem 0.3rem;
  border-radius: var(--radius);
  background: #f5f5f5;
  color: #999;
}

.value-list-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.header-body-layout {
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.seperator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--primary-caption);
  font-weight: 500;
  padding: 1.2rem 0.8rem 0.5rem 1rem;
}
.value-items {
  overflow: auto;
  flex: 1;
}
.value-item {
  display: flex;
  border: 1px solid #eaeaea;
  margin: 0.4rem 2rem;
  border-radius: var(--radius);
  padding: 0.4rem 0.8rem;
  justify-content: space-between;
  align-items: center;
}
.value-item .imgs-count {
  color: var(--primary-caption);
  font-size: 0.8rem;
}
.value-item .tag {
  border-radius: var(--radius);
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  color: var(--primary);
  background: #f0f8ff;
}
.value-item > .label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
}
.value-item > .label > .name {
  padding: 0.33rem 0 0.2rem 0;
}
.value-item > .label > .value-string {
  color: var(--primary-caption);
  font-size: 0.75rem;
  display: flex;
  line-height: 1;
  align-items: center;
  gap: 0.5rem;
}

.created {
  line-height: 0;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0rem;
  color: var(--primary-caption);
  user-select: none;
  opacity: 0.5;
}

.item-view-column.header {
  padding: 1rem 1.2rem;
}
.header > h3 {
  color: var(--primary-caption);
  font-weight: 500;
}

.item-view-column {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: visible;
}

/*
* Tablet
*/
@media screen and (max-width: 1023px) {
}

/*
* Phone
*/
@media screen and (max-width: 768px) {
  .seperator {
    padding: 0.4rem 0.8rem;
  }
  .value-item {
    margin: 0.4rem 0.8rem;
  }
  .item-view-column.header {
    padding: 0.4rem 0.8rem;
  }
}
</style>
