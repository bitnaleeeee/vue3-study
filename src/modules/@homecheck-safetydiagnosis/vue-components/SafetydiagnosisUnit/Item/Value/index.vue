<template>
  <div style="border-top: 1px solid #f0f0f0" class="input-layout">
    <!--1) 카테고리 선택-->
    <div class="column">
      <div class="align-center">
        <i class="bx" :class="props.selectedValue.getType() ? 'bxs-check-circle' : 'bxs-error'"></i>
        <span>종류</span>
      </div>
      <UIContext v-model="Context.type" padding="none" :minWidth="300">
        <div class="context align-center" @click="Context.type = !Context.type" :class="Context.type ? 'active' : ''">
          {{ props.selectedValue.getType() ? props.selectedValue.getTypeString() : "선택되지 않음" }}
          <i class="bx bx-caret-down"></i>
        </div>
        <template #content>
          <div class="category-selector">
            <div class="group">
              <div v-if="props.selectedItem.isAppearence()" class="context-items">
                <div
                  v-wave
                  @click.self="Context.type = false"
                  @click="setPropsModelType(`${props.selectedItem.type}_value_type`, item)"
                  class="item"
                  :class="props.selectedValue.getType() == item ? 'active' : ''"
                  v-for="(item, i) in appearenceInspection"
                  :key="i"
                >
                  {{ inspectionString[item] }}
                </div>
              </div>
              <div v-if="props.selectedItem.isInspections()" class="context-items">
                <div
                  v-wave
                  v-show="
                    !(item == safetyInspection.SlopeValue && props.selectedItem.getValueByType(safetyInspection.SlopeValue)) &&
                    !(item == safetyInspection.SubsidenceValue && props.selectedItem.getValueByType(safetyInspection.SubsidenceValue))
                  "
                  @click.self="Context.type = false"
                  @click="setPropsModelType(`${props.selectedItem.type}_value_type`, item)"
                  class="item"
                  :class="[props.selectedValue.getType() == item ? 'active' : '', props.selectedValue.getType()]"
                  v-for="(item, i) in safetyInspection"
                  :key="i"
                >
                  {{ inspectionString[item] }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </UIContext>
    </div>
    <!-- 1.1 외관 조사인 경우, 상세 항목 입력-->
    <UITransitionExpand>
      <div v-if="props.selectedItem.isAppearence()" class="appearence-detail" style="z-index: 1">
        <div v-if="props.selectedValue.includedToInspections() && props.isInspectionProject" class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 상태 평가 </span>
          </div>
          <div class="context" style="font-weight: 700" @click="changeIsInspection">
            {{ props.selectedValue.getInspectionsUIString() }}
          </div>
        </div>
        <div class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 부재 </span>
          </div>
          <UIContext v-model="Context.site" padding="none" :minWidth="300">
            <div class="context align-center" @click="Context.site = !Context.site" :class="Context.site ? 'active' : ''">
              {{ props.selectedValue.getSiteUIString() }}
              <i class="bx bx-caret-down"></i>
            </div>
            <template #content>
              <div v-if="!props.selectedValue.isInspections" class="context-items">
                <div
                  v-wave
                  @click.self="Context.site = false"
                  @click="setPropsModelSite(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_site`, item.name)"
                  class="item"
                  :class="props.selectedValue.getSite() == item.name ? 'active' : ''"
                  v-for="(item, i) of props.settings.getSiteItems()"
                  :key="i"
                >
                  {{ item.name }}
                </div>
              </div>
              <div v-else class="context-items">
                <div
                  v-wave
                  @click.self="Context.site = false"
                  @click="setPropsModelFixedSite(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_fixedsite`, key)"
                  class="item"
                  :class="props.selectedValue.getFixedSite() == key ? 'active' : ''"
                  v-for="(item, key) in props.selectedValue.getFixedSites()"
                  :key="key"
                >
                  <span style="margin-right: 5px; font-size: 0.5rem; border: 1px solid #f0f0f0; padding: 0.12rem 0.3rem; border-radius: var(--radius); background: #f5f5f5; color: #999"
                    >상태평가 항목</span
                  >
                  <span>{{ item }}</span>
                </div>
              </div>
            </template>
          </UIContext>
        </div>
        <div class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 세부 항목 </span>
          </div>
          <UIContext v-model="Context.value" padding="none" :minWidth="300">
            <div class="context align-center" @click="Context.value = !Context.value" :class="Context.value ? 'active' : ''">
              {{ props.selectedValue.getValueUIString() }}
              <i class="bx bx-caret-down"></i>
            </div>
            <template #content>
              <div v-if="!props.selectedValue.isInspections" class="context-items">
                <div
                  v-wave
                  @click.self="Context.value = false"
                  @click="
                    () => {
                      props.selectedValue.setValue(item.name);
                      props.selectedValue.setRepairId(item.repair_id);
                    }
                  "
                  class="item"
                  :class="props.selectedValue.getValue() == item.name ? 'active' : ''"
                  v-for="(item, i) of props.settings.getAppearenceItems(props.selectedValue.getType())"
                  :key="i"
                >
                  {{ item.name }}
                </div>
              </div>
              <div v-else class="context-items">
                <div
                  v-wave
                  @click.self="Context.value = false"
                  @click="
                    () => {
                      props.selectedValue.setValue(item);
                    }
                  "
                  class="item"
                  :class="props.selectedValue.getValue() == item ? 'active' : ''"
                  v-for="(item, i) of props.selectedValue.getValuesArray()"
                  :key="i"
                >
                  {{ item }}
                </div>
              </div>
            </template>
          </UIContext>
        </div>
        <div class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 보수 방안 </span>
          </div>
          <UIContext v-model="Context.repair_id" padding="none" :minWidth="300" zIndex="999999">
            <div class="context align-center" @click="Context.repair_id = !Context.repair_id" :class="Context.repair_id ? 'active' : ''">
              {{ props.settings.getRepairItem(props.selectedValue.repair_id).name }}
              <i class="bx bx-caret-down"></i>
            </div>
            <template #content>
              <div class="context-items">
                <div
                  v-wave
                  @click.self="Context.repair_id = false"
                  @click="props.selectedValue.setRepairId(item._id)"
                  class="item"
                  :class="props.selectedValue.getRepairId() == item._id ? 'active' : ''"
                  v-for="(item, i) of props.settings.getRepairItems()"
                  :key="i"
                >
                  {{ item.name }}
                </div>
              </div>
            </template>
          </UIContext>
        </div>
        <div class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 내부/ 외부 </span>
          </div>
          <div class="context" style="font-weight: 700" @click="changeIsInternal()">
            {{ props.selectedValue.getInternalUIString() }}
          </div>
        </div>
        <div v-if="props.isPrevious" class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span> 보수 여부 </span>
          </div>
          <div class="context" style="font-weight: 700" @click="props.selectedValue.changeRepaired()">
            {{ props.selectedValue.getRepairedUIString() }}
          </div>
        </div>
      </div>
      <div v-else-if="props.selectedItem.isInspections()" class="appearence-detail" style="z-index: 1">
        <div class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 부재 </span>
          </div>
          <UIContext v-model="Context.site" padding="none" :minWidth="300">
            <div class="context align-center" @click="Context.site = !Context.site" :class="Context.site ? 'active' : ''">
              {{ props.selectedValue.getSiteUIString() }}
              <i class="bx bx-caret-down"></i>
            </div>
            <template #content>
              <div class="context-items">
                <div
                  v-wave
                  @click.self="Context.site = false"
                  @click="setPropsModelSite(`${DataTypes.SAFETYDIAGNOSIS_INSPECTION}_value_site`, item)"
                  class="item"
                  :class="props.selectedValue.getSite() == item ? 'active' : ''"
                  v-for="(item, i) in FixedSite"
                  :key="i"
                >
                  {{ FixedSiteString[item] }}
                </div>
              </div>
            </template>
          </UIContext>
        </div>
      </div>
    </UITransitionExpand>
    <div class="appearence-detail" v-if="props.selectedItem.isAppearence()">
      <SafetydiagnosisUnitItemValueAppearences v-model="props.selectedValue" />
    </div>
    <div v-else class="appearence-detail">
      <SafetydiagnosisUnitItemValueInspections v-model="props.selectedValue" :isNewValue="props.isNewValue" />
    </div>
    <div class="column">
      <div class="align-center">
        <i class="bx" :class="props.selectedValue.getImgs().length != 0 ? 'bxs-check-circle' : 'bxs-minus-circle'"></i>
        <span>사진</span>
      </div>

      <BrowserCamera @onFileAdded="onValueImageAdd">추가하기</BrowserCamera>
    </div>

    <div class="imgs">
      <div v-for="(img, i) in props.selectedValue.getImgs()" :key="i" 
      :class="[ props.selectedValue.getImgs().filter(_img => _img.force).length == 0 && i == 0 ? 'active' : '' ,img.force ? 'active' : '']"
      class="img" v-wave @click="onValueImageClicked(img)">
        <AsyncImg @error="onError" :source="imgPattern(img.url)" />
      </div>
    </div>
    <br />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DataTypes } from "@/modules/@homecheck-safetydiagnosis/models/data";
import { appearenceInspection, safetyInspection, inspectionString, FixedSiteString, FixedSite } from "@/modules/@homecheck-safetydiagnosis/models/values";
import { setCache, actionWithCache } from "@/modules/@homecheck/libs/Cache";

const props = defineProps({
  selectedValue: Object,
  selectedItem: Object,
  isNewValue: Boolean,
  isPrevious: Boolean,
  isInspectionProject: Boolean,
  settings: Object,
  imgPattern: Function,
});

const emit = defineEmits(["update:selectedValue", "onValueImageClicked", "onValueImageAdd", "onValueImageLoadFailed", "onValueUpdate", "onErrorImage"]);
const tabIndex = ref(0);
const Context = ref({});

function onValueImageClicked(img) {
  emit("onValueImageClicked", img);
}

function onValueImageAdd(file: File) {
  emit("onValueImageAdd", file);
}
function onValueImageLoadFailed(e) {
  emit("onValueImageLoadFailed", e);
}
function onError(e) {
  emit("onErrorImage", e);
}

onMounted(() => {
  if (!props.isNewValue) return;

  //이전에 사용하던 부재 그대로 이용하기

  if (props.selectedItem.isAppearence()) {
    actionWithCache(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_site`, (type) => {
      props.selectedValue.setSite(type);
    });

    actionWithCache(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_value`, (type) => {
      props.selectedValue.setValue(type);
    });

    actionWithCache(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_isInternal`, (bool) => {
      props.selectedValue.setInternal(bool == "true");
    });
  } else if (props.selectedItem.isInspections()) {
    actionWithCache(`${DataTypes.SAFETYDIAGNOSIS_INSPECTION}_value_site`, (type) => {
      props.selectedValue.setSite(type);
    });
  }

  // 타입값 이전에 사용했던 기록 그대로 사용하기
  actionWithCache(`${props.selectedItem.type}_value_type`, (type) => {
    console.log(type);
    // 만약 기울기나 침하라면 건너뛰기
    if (props.selectedItem.getValuesByType(safetyInspection.SlopeValue) && type == safetyInspection.SlopeValue) {
    } else if (props.selectedItem.getValuesByType(safetyInspection.SubsidenceValue) && type == safetyInspection.SubsidenceValue) {
    } else {
      props.selectedValue.setType(type);
      updateModelValue(props.selectedItem.Parser(props.selectedValue));
    }
  });
});

function changeIsInspection() {
  props.selectedValue.changeInspections();
  actionWithCache(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_fixedsite`, (type) => {
    props.selectedValue.setFixedSite(type);
  });
}

function changeIsInternal() {
  props.selectedValue.changeInternal();
  setCache(`${DataTypes.SAFETYDIAGNOSIS_APPEARENCE}_value_isInternal`, `${props.selectedValue.getInternal()}`);
}

function setPropsModelType(cache_key: string, type: string) {
  setCache(cache_key, type);
  props.selectedValue.setType(type);
  updateModelValue(props.selectedItem.Parser(props.selectedValue));
}

function setPropsModelSite(cache_key: string, site: string) {
  setCache(cache_key, site);
  props.selectedValue.setSite(site);
}

function setPropsModelFixedSite(cache_key: string, site: string) {
  setCache(cache_key, site);
  props.selectedValue.setFixedSite(site);
}

function updateModelValue(input) {
  //emit("update:selectedValue", input);
  //onValueUpdate
  emit("onValueUpdate", input);
  // props.selectedItem.updateValue(input);
}
</script>
<style scoped>
.context-items {
  max-height: 50vh;
  overflow: auto;
}

.imgs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  align-items: center;
  padding: 0.5rem 1.2rem;
  grid-gap: 0.33rem;
}

.img {
  height: 100%;
}
.img.active > * {
  border: 2px solid var(--primary);
}

.img > * {
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: var(--radius);
  border: 1px solid #eaeaea;
  display: block;
  object-fit: cover;
}

.category-selector {
  display: flex;
  flex-direction: column;
  max-height: 50vh;
}
.category-selector > .tab {
  display: flex;
}
.category-selector > .tab > * {
  flex: 1;
  padding: 0.4rem 0;
  text-align: center;
  color: #999;
  font-weight: 300;
  border-bottom: 2px solid #eaeaea;
}
.category-selector > .tab > *.active {
  border-color: var(--primary);
  color: #333;
  font-weight: 500;
}
.category-selector > .group > .seperator {
  color: var(--primary-caption);
  font-size: 0.8rem;
  padding: 0 0.8rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eaeaea;
}
.category-selector > .group {
  flex: 1;
  overflow: auto;
}

.context-items > .item {
  padding: 0.6rem 1.2rem;
}
.context-items > .item.active {
  background: #0f0f0f;
  color: #fff;
  font-weight: 500;
}

.appearence-detail {
  margin: 0 1.2rem;
  border-radius: var(--radius);
  background: #f9fafb;
}
.appearence-detail > .label {
  color: var(--primary-caption);
  padding: 0.75rem 1rem;
  font-weight: 300;
  font-size: 0.8rem;
}

.input-layout {
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  z-index: 1;
  flex: 1;
  overflow: auto;
}
.input-layout > * {
  margin: 0.165rem 1.2rem;
}
.input-layout > *:first-child {
  margin-top: 0;
}
.input-layout > *:last-child {
  margin-bottom: 0;
}

.align-center {
  display: flex;
  align-items: center;
}
.align-center > * {
  margin: 0 0.165rem;
}
.align-center > *:first-child {
  margin-left: 0;
}
.align-center > *:last-child {
  margin-right: 0;
}

.column {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.2rem;
}

.column .key {
  color: var(--primary-caption);
  font-size: 0.8rem;
}

.context {
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.context.active {
  background: var(--button-hover);
}

.bxs-check-circle {
  color: #0f0f0f;
}
.bxs-minus-circle {
  color: #aaa;
}
.bxs-error {
  color: red;
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
  .input-layout > * {
    margin: 0.165rem 0.4rem;
  }

  .column {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.2rem;
  }
}
</style>
