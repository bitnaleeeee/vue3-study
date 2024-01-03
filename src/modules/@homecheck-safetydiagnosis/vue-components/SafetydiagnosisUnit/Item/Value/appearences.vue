<template>
  <div style="padding: 0.4rem 0">
    <div class="column" v-for="(_item, i) in props.modelValue.getValuesUIArray()" :key="i">
      <div class="align-center">
        <i class="bx" :class="props.modelValue[`validCheck_${_item.property}`]() ? 'bxs-check-circle' : 'bxs-error'"></i>
        <span class="key"> {{ _item.name }} </span>
      </div>
      <div>
        <UINumberpad
          style="height: auto; flex: 1"
          :unit="
          appearenceInspection.LengthValue == props.modelValue.type
          || appearenceInspection.AreaValue == props.modelValue.type 
          || (appearenceInspection.CrackValue == props.modelValue.type 
          && _item.name == '길이') ? 'm' : 'mm'"
          v-model="props.modelValue[_item.property]"
          :width="200"
          :allowPoint="true"
          :maxlength="5"
        />
      </div>
    </div>
    <div class="column">
      <div class="align-center">
        <i class="bx" :class="props.modelValue.validCheck_quantity() ? 'bxs-check-circle' : 'bxs-error'"></i>
        <span class="key"> 수량 </span>
      </div>
      <div>
        <UINumberpad style="height: auto; flex: 1" unit="ea" v-model="props.modelValue.quantity" :width="200" :allowPoint="false" :maxlength="3" />
      </div>
    </div>
    <UITransitionExpand>
      <div v-if="props.modelValue.isInspections">
        <hr />
        <div class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> {{ props.modelValue.getGradeTitle() }} </span>
          </div>
          <div>
            <div
              class="radio-item"
              :class="props.modelValue.getGrade() == key ? 'active' : ''"
              v-for="(item, key) in props.modelValue.getAllGrades()"
              :key="key"
              @click="props.modelValue.setGrade(key)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div v-if="props.modelValue.getAllAreas()" class="column">
          <div class="align-center">
            <i class="bx bxs-check-circle"></i>
            <span class="key"> 면적율 </span>
          </div>
          <div>
            <div class="radio-item" :class="props.modelValue.getArea() == key ? 'active' : ''" v-for="(item, key) in props.modelValue.getAllAreas()" :key="key" @click="props.modelValue.setArea(key)">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </UITransitionExpand>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { appearenceInspection } from "@/modules/@homecheck-safetydiagnosis/models/values";

const props = defineProps({
  modelValue: Object,
});
</script>
<style scoped>
.column .key {
  color: var(--primary-caption);
  font-size: 0.8rem;
}
.radio-item {
  padding: 0.33rem;
  text-align: right;
  color: #999;
}
.radio-item.active {
  color: #333;
  font-weight: 700;
}

.column {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 1.2rem;
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

/*

 > * {
  margin : 0 0.165rem;
}
 > *:first-child {
  margin-left: 0;
}
 > *:last-child {
  margin-right: 0;
}




 > * {
  margin : 0 0.165rem;
}
 > *:first-child {
  margin-top: 0;
}
 > *:last-child {
  margin-bottom: 0;
}



*/

.ad {
  color: #357eb67e;
}
.bxs-check-circle {
  color: #0f0f0f;
}
.bxs-error {
  color: red;
}
</style>
