<template>
  <div>
    <!-- 슈미트 해머 -->
    <div v-if="props.modelValue.type == safetyInspection.SchmidtValue">
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key">값</span>
        </div>
        <div style="display: flex; align-items: center">
          <UIButton type="black-out circle" size="sm" @click="schmidtInput = !schmidtInput">연속 입력</UIButton>
          <h4 @click="schmidtLayout = !schmidtLayout">{{ schmidtLayout ? "4X5" : "5X4" }}</h4>
        </div>
      </div>

      <div v-if="props.modelValue.value" class="schmidtValue-layout" :class="schmidtLayout ? 'l4X5' : 'l5X4'">
        <UINumberpad
          v-wave
          class="schmidt-item"
          v-for="(item, i) in Array.from({ length: 20 })"
          :key="i"
          v-model="props.modelValue.value[i]"
          :width="200"
          :allowPoint="false"
          :maxlength="3"
          padding="none"
        >
        </UINumberpad>
      </div>

      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 측정 부위 </span>
        </div>
        <div>
          <h4 @click="props.modelValue.changePosition">{{ props.modelValue.getPositionString() }}</h4>
        </div>
      </div>

      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 콘크리트 재령 일수 </span>
        </div>
        <div>
          <UINumberpad
            @onChanged="(e) => setCache('schmidt_concreteInput', e)"
            style="height: auto; flex: 1"
            unit="일"
            v-model="props.modelValue.concreteInput"
            :width="200"
            :allowPoint="false"
            :maxlength="8"
          />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 추정 설계 강도 </span>
        </div>
        <div>
          <UINumberpad
            @onChanged="(e) => setCache('schmidt_designedStrength', e)"
            style="height: auto; flex: 1"
            unit="MPa"
            v-model="props.modelValue.designedStrength"
            :width="200"
            :allowPoint="false"
            :maxlength="8"
          />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 손상 여부 </span>
        </div>
        <h3 style="font-size: 0.85rem; color: #333" @click="props.modelValue.changeCracked()">
          {{ props.modelValue.getCrackString() }}
        </h3>
      </div>

      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 측정 각도 </span>
        </div>
        <UIContext v-model="Context.angle" padding="none" :minWidth="300">
          <div class="context align-center" @click="Context.angle = !Context.angle" :class="Context.angle ? 'active' : ''">
            {{ props.modelValue.getAngleString() }}
            <i class="bx bx-caret-down"></i>
          </div>
          <template #content>
            <div class="category-selector">
              <div class="group">
                <div class="items">
                  <div
                    v-wave
                    @click.self="Context.angle = false"
                    @click="props.modelValue.setAngle(item)"
                    class="item"
                    :class="props.modelValue.getAngle() == item ? 'active' : ''"
                    v-for="(item, i) in schmidtAngleConstant"
                    :key="i"
                  >
                    {{ schmidtAngleConstantString[item] }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UIContext>
      </div>

      <table class="value-table">
        <template v-if="props.modelValue.designedStrength >= 40">
          <thead>
            <th v-for="method in HardSchdmitCalculateMethodString" :key="method">
              {{ method.name }}
            </th>
          </thead>
          <tr>
            <td v-for="(method, mkey) in HardSchdmitCalculateMethodString" :key="method">
              {{ props.modelValue.getCalculateWithHardMethod(mkey) }}
            </td>
          </tr>
        </template>
        <template v-else>
          <thead>
            <th v-for="method in SchdmitCalculateMethodString" :key="method">
              {{ method.name }}
            </th>
          </thead>
          <tr>
            <td v-for="(method, mkey) in SchdmitCalculateMethodString" :key="method">
              {{ props.modelValue.getCalculateWithMethod(mkey) }}
            </td>
          </tr>
        </template>
      </table>

      <div class="caption">재령 계수, 직선 보간법: {{ props.modelValue.getConcreteConstant() }}, 각도에 의한 보정치 : {{ props.modelValue.getAngleCorrection() }} 적용</div>

      <br />
      <UIOverlayWindow v-model="schmidtInput">
        <div class="schmidtValue-input-layout">
          <div class="header">콘크리트 비파괴 측정 - 연속 입력</div>
          <div class="split-layout">
            <div style="padding : 0 1rem">
              <div style="text-align:center; color : var(--primary-caption); font-size : 0.8rem">현재 입력중인 값</div>
              <div style="text-align:center;font-size: 2.5rem; letter-spacing : -2px;font-weight:500">
              {{props.modelValue.value[schmidtIndex] ? props.modelValue.value[schmidtIndex] : 0}}
              </div>
              <br/>
            <div class="schmidtValue-layout" :class="schmidtLayout ? 'l4X5' : 'l5X4'">
              <div v-wave class="schmidt-item" 
              @click="schmidtIndex = i"
              :class="schmidtIndex == i ? 'active' : ''"
              v-for="(item, i) in Array.from({ length: 20 })" :key="i" >
                {{props.modelValue.value[i] ? props.modelValue.value[i] : 0}}
              </div>
            </div>
            </div>
            <div class="inputs">
              <UIInputGraph v-model="props.modelValue.value[schmidtIndex]" :maxX="10" :maxY="90"
              :origin="props.modelValue.value"
              @setToArray="props.modelValue.value = []"
              
              @onChanged="()=>{
                if(schmidtIndex != 19){
                  schmidtIndex++;
                }
                else {
                  schmidtIndex = 0
                }
              }"
              />
            </div>
          </div>
        </div>
      
      </UIOverlayWindow>

    </div>
    <!-- 탄산화 -->
    <div v-else-if="props.modelValue.type == safetyInspection.CarbonationValue">
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_depth() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 깊이 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.depth" :width="200" :allowPoint="true" :maxlength="8" />
        </div>
      </div>

      <SafetydiagnosisUnitItemValueInspections v-model="props.modelValue.rebar" :isNewValue="props.isNewValue" />
    </div>
    <!-- 철근 피복-->
    <div v-else-if="props.modelValue.type == safetyInspection.RebarValue">
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_thickness() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 철근 피복 두께 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.thickness" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 측정 위치 </span>
        </div>
        <div>
          <h4 @click="props.modelValue.changeLocation">{{ props.modelValue.getLocationString() }}</h4>
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 철근 메모 </span>
        </div>
        <div>
          <textarea v-model="props.modelValue.memo" />
        </div>
      </div>
    </div>
    <!-- 기울기 -->
    <div v-else-if="props.modelValue.type == safetyInspection.SlopeValue">
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle" />
          <span class="key"> 방향 </span>
        </div>
        <div>
          <h4 @click="props.modelValue.changeDirection">{{ props.modelValue.getDirectionString() }}</h4>
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_value() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 변위량 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.writeonly__value" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_height() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 측정 높이 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="m" v-model="props.modelValue.writeonly__height" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <div style="color: var(--primary-caption); text-align: right; padding: 0 1.2rem 0.4rem 1.2rem; font-size: 0.75rem">
        {{ props.modelValue.getGradeString() }}
      </div>
    </div>
    <!-- 침하-->
    <div v-else-if="props.modelValue.type == safetyInspection.SubsidenceValue">
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_outside() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 단부 1 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.writeonly__outside[0]" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_center() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 중앙부 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.writeonly__center" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_outside() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 단부 2 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.writeonly__outside[1]" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx" :class="props.modelValue.validCheck_length() ? 'bxs-check-circle' : 'bxs-error'"></i>
          <span class="key"> 측정 길이 </span>
        </div>
        <div>
          <UINumberpad style="height: auto; flex: 1" unit="m" v-model="props.modelValue.writeonly__length" :width="200" :allowPoint="false" :maxlength="8" />
        </div>
      </div>
      <!--
      *단부 평균 - 중앙부 = {{ props.modelValue.getValue() }}mm (반올림)
    -->
      <div style="color: var(--primary-caption); text-align: right; padding: 0 1.2rem 0.4rem 1.2rem; font-size: 0.75rem">
        {{ props.modelValue.getGradeString() }}
      </div>
    </div>
    <!-- 부재 실측-->
    <div v-else-if="props.modelValue.type == safetyInspection.MeasurementValue">
      <div class="column">
        <div class="align-center" style="flex: 1">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 부재 이름 </span>
        </div>
        <div style="flex: 1">
          <input style="height: auto; width: 100%" v-model="props.modelValue.value" />
        </div>
      </div>
      <div v-if="props.modelValue.getSite() == FixedSite.Column || props.modelValue.getSite() == FixedSite.Beam || props.modelValue.getSite() == FixedSite.Girder">
        <div class="column">
          <div class="align-center">
            <i class="bx" :class="props.modelValue.validCheck_width() && props.modelValue.validCheck_height() ? 'bxs-check-circle' : 'bxs-error'"></i>
            <span class="key"> 폭 * 높이 </span>
          </div>
          <div>
            <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.width" :width="200" :allowPoint="false" :maxlength="8" />
            <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.height" :width="200" :allowPoint="false" :maxlength="8" />
          </div>
        </div>
        <div class="column">
          <div class="align-center">
            <i class="bx" :class="props.modelValue.validCheck_designed_width() && props.modelValue.validCheck_designed_height() ? 'bxs-check-circle' : 'bxs-error'"></i>
            <span class="key"> 설계 폭 * 높이</span>
          </div>
          <div>
            <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.designed_width" :width="200" :allowPoint="false" :maxlength="8" />
            <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.designed_height" :width="200" :allowPoint="false" :maxlength="8" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="column">
          <div class="align-center">
            <i class="bx" :class="props.modelValue.validCheck_thickness() ? 'bxs-check-circle' : 'bxs-error'"></i>
            <span class="key"> 두께 </span>
          </div>
          <div>
            <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.thickness" :width="200" :allowPoint="false" :maxlength="8" />
          </div>
        </div>
        <div class="column">
          <div class="align-center">
            <i class="bx" :class="props.modelValue.validCheck_designed_thickness() ? 'bxs-check-circle' : 'bxs-error'"></i>
            <span class="key"> 설계 두께 </span>
          </div>
          <div>
            <UINumberpad style="height: auto; flex: 1" unit="mm" v-model="props.modelValue.designed_thickness" :width="200" :allowPoint="false" :maxlength="8" />
          </div>
        </div>
      </div>
      <div v-if="props.modelValue.getSite() == FixedSite.Beam || props.modelValue.getSite() == FixedSite.Girder" class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 슬래브 포함 여부 </span>
        </div>
        <div>
          <h4 @click="props.modelValue.changeOverlappedWithSlab">{{ props.modelValue.getOverlapSlabString() }}</h4>
        </div>
      </div>
      <div class="column">
        <div class="align-center">
          <i class="bx bxs-check-circle"></i>
          <span class="key"> 마감재 포함 여부 </span>
        </div>
        <div>
          <h4 @click="props.modelValue.changeOverlappedWithMaterials">{{ props.modelValue.getOverlapMaterialsString() }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import SafetydiagnosisUnitItemValueInspections from "./inspections.vue";

import { safetyInspection, SchdmitCalculateMethodString, HardSchdmitCalculateMethodString } from "@/modules/@homecheck-safetydiagnosis/models/values/index";
import { schmidtAngleConstant, schmidtAngleConstantString, schmidtPosition, schmidtPositionString } from "@/modules/@homecheck-safetydiagnosis/models/values/const";
import { FixedSite } from "@/modules/@homecheck-safetydiagnosis/models/values";

import { setCache, actionWithCache } from "@/modules/@homecheck/libs/Cache";

const props = defineProps({
  modelValue: Object,
  isNewValue: Boolean,
});

const schmidtLayout = ref(true);
const schmidtInput = ref(false);
const schmidtIndex = ref(0);

const Context = ref({});

watch(
  () => props.modelValue,
  (to, from) => {
    if (!props.isNewValue) return;
    //이전에 사용하던 콘크리트 일수 및 설계 강도 그대로 이용하기

    if (to.type == safetyInspection.SchmidtValue) {
      actionWithCache(`schmidt_concreteInput`, (val) => {
        props.modelValue.concreteInput = parseInt(val);
      });

      actionWithCache(`schmidt_designedStrength`, (val) => {
        props.modelValue.designedStrength = parseInt(val);
      });
    }
  }
);
</script>
<style scoped>
.schmidtValue-input-layout {
  display: flex;
  flex-direction: column;
}
.schmidtValue-input-layout > .header {
  font-size: 0.7rem;
  background: rgb(249, 250, 252);
  padding: 0.1rem 0.4rem;
  border-bottom: 1px solid #d4dada;
  color: var(--primary-caption);
}

.schmidtValue-input-layout > .split-layout {
  padding: 0.6rem 1.2rem;
  display: flex;
  background: #fff;
  align-items: center;
}
.schmidtValue-input-layout > .split-layout > * {
  margin: 0 0.75rem;
}
.schmidtValue-input-layout > .split-layout > *:first-child {
  margin-left: 0;
}
.schmidtValue-input-layout > .split-layout > *:last-child {
  margin-right: 0;
}

.schmidtValue-input-layout > .split-layout > * {
  flex: 1;
}

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

.schmidtValue-layout {
  display: grid;
  grid-gap: 0.2rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  width: fit-content;
  margin: 0 auto;
}
.schmidtValue-layout.l4X5 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.schmidtValue-layout.l5X4 {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.schmidt-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 2.25rem;
  background: #eff3f7;
  width: 2.25rem;
  text-align: center;
  color: #999;
  border-radius: var(--radius);
  font-weight: 500;
}
.schmidt-item.active {
  background: #0f0f0f;
  color: #fff;
}

h4 {
  padding: 0.2rem 0.6rem;
  color: var(--primary-caption);
}
.caption {
  font-size: 0.75rem;
  color: var(--primary-caption);
  text-align: right;
  padding: 0 1.2rem;
}

.column {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.2rem;
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

.bxs-check-circle {
  color: #0f0f0f;
}
.bxs-error {
  color: red;
}

.category-selector {
  display: flex;
  flex-direction: column;
  max-height: 50vh;
}

.category-selector > .group {
  flex: 1;
  overflow: auto;
}

.items > .item {
  padding: 0.6rem 1.2rem;
}
.items > .item.active {
  background: #0f0f0f;
  color: #fff;
  font-weight: 500;
}

.context {
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.context.active {
  background: var(--button-hover);
}

.value-table {
  width: calc(100% - 2.4rem);
  box-sizing: border-box;
  border-collapse: collapse;
  margin: 0.4rem 1.2rem;
  border-radius: var(--radius);
  background: #0f0f0f03;
}

.value-table > thead {
  font-size: 0.6rem;
}
.value-table > thead > th {
  border-bottom: 1px solid #999;
  color: #666;
  font-weight: 300;
  padding: 0.3rem;
}

.value-table > tr {
  text-align: center;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}
.value-table > tr > td {
  padding: 0.4rem 0;
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
  .split-layout {
    flex-direction: column;
  }
}
</style>
