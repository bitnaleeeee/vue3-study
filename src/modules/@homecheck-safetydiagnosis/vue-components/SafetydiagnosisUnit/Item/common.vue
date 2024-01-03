<template>
  <div class="layout">

    <div>
    <span class="sub-header">표시 방식</span>
    <UIContext v-model="Context.SelectPathShape" padding="none" width="fill">
      <div class="select-box" :class="Context.SelectPathShape ? 'active' : ''" @click="Context.SelectPathShape = !Context.SelectPathShape">
        <UIItem :icon="cursorCheatsheet[viewPathShape].icon" :label="cursorCheatsheet[viewPathShape].label" :description="cursorCheatsheet[viewPathShape].description"></UIItem>
        <i class="bx bx-chevron-down"></i>
      </div>
      <template #content>
        <div>
          <UIItem
            v-for="(item, i) in cursorCheatsheet"
            :key="i"
            :active="props.selectedItem.getPathShapeType() == i"
            @click="props.selectedItem.setPathShapeType(i)"
            :icon="item.icon"
            :label="`${item.label}`"
            :description="item.description"
          ></UIItem>
        </div>
      </template>
    </UIContext>
    </div>
    <div v-if="props.isPrevious">
      <span class="sub-header">발견 시점</span>
      <UIContext v-model="Context.SelectPreviousSchedule" padding="none" width="fill">
        <div class="select-box" :class="Context.SelectPreviousSchedule ? 'active' : ''" @click="Context.SelectPreviousSchedule = !Context.SelectPreviousSchedule">
          <h4>{{props.selectedItem.getScheduleIdString(props.projectCheatsheet)}}</h4>
          <i class="bx bx-chevron-down"></i>
        </div>
        <template #content>
          <div style="max-height:40vh; overflow:auto">
            <div class="schedule-box"
            :class="props.selectedItem.schedule_id == 'Annonymous' ? 'active' : ''"
            @click="props.selectedItem.setScheduleId('Annonymous')">
              <h4>정확하지 않음</h4>
            </div>
            <div class="schedule-box"
            :class="props.selectedItem.schedule_id == project._id ? 'active' : ''"
            @click="props.selectedItem.setScheduleId(project._id)"
            v-for="(project) of props.projects.filter(__project => __project._id != props.currentProjectId)" :key="project._id">
              <h4>{{project.name}}</h4>
            </div>
          </div>
        </template>
      </UIContext>
    </div>


    <div>
    <span class="sub-header">메모</span>
    <textarea class="memo" v-model="props.selectedItem.memo"></textarea>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { pathShape } from "@/modules/@homecheck-safetydiagnosis/models/values/render";

const props = defineProps({
    selectedItem : {
        default : null,
        type : Object
    },
    isPrevious : {
      default : false,
      type : Boolean
    },
    projects : {
      default : [],
      type : Array
    },
    currentProjectId : {
      default : "",
      type : String
    },
    projectCheatsheet : {
      default : {},
      type : Object
    }
})

const Context = ref({})
const viewPathShape = computed(() => {
  return props.selectedItem?.getPathShapeType();
});

const cursorCheatsheet = {
  [pathShape.Point]: {
    icon: "fi fi-br-bullet",
    label: "점",
    description: "점 형태",
  },
  [pathShape.Line]: {
    icon: "fi fi-br-slash",
    label: "선형",
    description: "선 형태",
  },
  [pathShape.Arrow]: {
    icon: "fi fi-bs-arrow-up-right",
    label: "화살표",
    description: "선 형태",
  },
  [pathShape.DoubleArrow]: {
    icon: "fi fi-rr-arrows-alt-h",
    label: "양방향 화살표",
    description: "선 형태",
  },
  [pathShape.Circle]: {
    icon: "fi fi-br-circle",
    label: "원형",
    description: "원 형태",
  },
  [pathShape.Rect]: {
    icon: "fi fi-sr-no-people",
    label: "사각형",
    description: "사각형 형태",
  },
};
</script>
<style scoped>
.memo {
  width : calc(100% - 1.6rem); 
  display: block;
}
.layout {
  display: flex;
  flex-direction: column;
  padding: 0 1.2rem 1rem 1.2rem;
  border-bottom: 2px solid #f5f7f9;
}

input,
textarea {
  box-sizing: border-box;
  font-size: 13.5px;
  padding: 0.5rem 0.8rem;
  margin: 0.3rem 0.8rem;
  background: #f9fafb;
  border: var(--border-input);
  color: var(--font);
  transition: all 0.25s ease;
  border-radius: var(--radius);
  resize: none;
}
input:focus,
textarea:focus {
  box-shadow: none;
  border: 1px solid var(--primary-weak);
  outline: none;
}
input:hover,
textarea:hover {
  border: 1px solid var(--primary);
}

.schedule-box {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--radius);
  background: #fff;
  padding-right: 1rem;
  transition: all 0.2s ease;
}
.schedule-box > h4 {
}

.select-box {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--radius);
  background: #fff;
  padding-right: 1rem;
  margin: 0.3rem 0.8rem;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;
}
.schedule-box > h4,
.select-box > h4 {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
}
.schedule-box.active,
.schedule-box:hover,
.select-box.active,
.select-box:hover {
  background: rgb(242, 245, 249);
}

.sub-header {
  color: var(--primary-caption);
  font-size: 0.8rem;
  padding: 0.5rem 0.8rem 0 1rem;
}



/*
* Tablet
*/
@media screen and (max-width: 1023px){

}

/*
* Phone
*/
@media screen and (max-width: 768px){
 .layout {
    padding: 0;
    border : none;
    gap : 0.8rem;
    flex-direction: row;
    overflow-x : auto;
  }
   .layout > * {
    flex: 1;
    min-width: 60%;
    display: flex;
    flex-direction: column;
   }
   .layout > *:first {
    margin-left : 0.8rem;

   }
      .layout > *:first-child {
    margin-left : 0.8rem;

   }

   .layout > * > *:nth-child(2) {
    flex:1;
   }

  .select-box {
    margin:  0.3rem 0rem 0.3rem 0rem;
    height: calc(100% - 0.6rem);
  }

  textarea {
    margin : 0.3rem 0rem 0.3rem 0rem;
    width : calc(100% - 0.8rem) !important;
  }
  .description {
    font-size: 0.7rem;;
  }

  .layout::-webkit-scrollbar, .layout::-webkit-scrollbar-thumb {
    width: 1px;
    border-radius: unset;
    
  }
  .layout::-webkit-scrollbar-thumb {
    background : #f0f0f0
  }

  .sub-header {
    padding: 0  0 0 0.33rem;
  }
}
</style>
