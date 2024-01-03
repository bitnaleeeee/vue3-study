<template>
  <div ref="dropdown" class="drop-down-frame" :class="{ active: open.opened }">
    <div @click="openChange" class="d-f" style="pointer: curosr">
      <span class="subtitle">
        {{ label }}
      </span>
      <img class="icon-down" :class="{ 'rotate-180': open.opened }" />
    </div>

    <div class="drop-down">
      <transition name="fade-appear">
        <ul v-show="open.opened" class="drop-down-list" :class="[
          config.id,
          config.right ? 'right' : '',
          config.top ? 'top' : '',
        ]">
          <li v-for="(item, i) in total_items" :key="i"
          @click="changeValue(item, i)" class="item" :class="{ active: innerIndex == i }" v-wave="{
              color: '#6a6a6a',
            }">
            {{ isLabel(item) }}
          </li>
          <li v-if="options.addItem" class="add item" v-wave="{
            color: '#6a6a6a',
          }" @click="addItemfunc">
            {{ addItemString() }}
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>
<script setup>
import { onClickOutside } from "@vueuse/core";
import _ from "lodash";
const emit = defineEmits(["update:modelValue", "onChanged"]);
const props = defineProps({
  items: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: [Array, Object, String, Number],
    default: {},
  },
  options: {
    type: Object,
    default: {},
  },
  defaults: {
    type: Array,
    default: [],
  },
});

const total_items = ref(
  computed(() => {
    return props.items.concat(props.defaults);
  })
);

const label = ref(
  computed(() => {
    if(props.modelValue == ''){
      innerIndex.value = -1
      return '선택되지 않음'
    }
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.length == 1 ? isLabel(props.modelValue[0]) : `${props.modelValue.length}개 선택됨`;
    }

    if(props.options.value){
      innerValue.value = total_items.value.find((item)=> item[props.options.value] == props.modelValue)
    }

    return isLabel(innerValue.value);
  })
);
const dropdown = ref(null);
const open = reactive({ opened: false });
const config = reactive({ id: randomString(7, false) });
const innerValue = ref(null);
const innerIndex = ref( -1)


onClickOutside(dropdown, (event) => (open.opened = false));

const changeValue = (item, index) => {
  const modelValue = props.modelValue;
  let emitValue = props.options.value ? item[props.options.value] : item;
  innerValue.value = item;
  innerIndex.value = index

  let from = proxyToValue(modelValue);
  let to = proxyToValue(item);
  if (Array.isArray(modelValue)) {
    let findIndex = _.findIndex(modelValue, {
      [props.options.label]: item[props.options.label],
    });
    findIndex > -1 ? modelValue.splice(findIndex, 1) : modelValue.push(item);
    emitValue = modelValue;
    to = proxyToValue(emitValue);
  }
  emit("update:modelValue", emitValue);
  emit("onChanged", {
    to: to,
    from: from,
  });
  open.opened = false;
};
const openChange = () => {
  open.opened = !open.opened;
  setTimeout(() => {
    let rect = document
      .getElementsByClassName(config.id)[0]
      .getBoundingClientRect();
      if (rect.x + rect.width > window.innerWidth) {
        config.right = true;
      }
      if (rect.y + rect.height + 50 > window.innerHeight) {
        config.top = true;
      }
    
  }, 1);
};
async function addItemfunc() {
  await props.options.addItem.command();
}
function addItemString() {
  try {
    return props.options.addItem.label ? props.options.addItem.label : "추가하기";
  } catch {
    return "추가하기";
  }
}

function isLabel(item) {
  if (!item) {
    return '선택되지 않음';
  }

  return props.options.label ? item[props.options.label] : item;
}

function randomString(length, withCharacter) {
  var charsNumber = "0123456789";
  var charsLower = "abcdefghijklmnopqrstuvwxyz";
  var charsUpper = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
  var charsSpecial = "!@#$%^&*()-_=+,<.>?|";
  var charsAll = [charsNumber, charsLower, charsUpper]; //  Include special character by default but allow checkbox to toggle option
  if (withCharacter) {
    //  Evaluate checkbox status
    charsAll = [charsNumber, charsLower, charsUpper, charsSpecial];
  }
  var chars = charsAll.join("");
  var randomString = "";
  for (var i = 0; i < length; i++) {
    // Get string length
    var randNum = Math.floor(Math.random() * chars.length); // and then
    randomString += chars.substring(randNum, randNum + 1); // randomize it
  }

  return randomString;
}
function proxyToValue(any) {
  return JSON.parse(JSON.stringify(any));
}
</script>

<style scoped>
.icon-down{
     content:url("@/assets/img/icn_down.svg");
}

.rotate-180{
    transform: rotate(-180deg);
}
.drop-down-list {
  margin: 12px 0;
  padding: 5px 0;
  position: fixed;
  min-width: 150px;
  border-radius: 8px;
  background-color: #f5f9fa;
  max-height: 350px;
  overflow-y: auto;
  opacity: 0.95;
  z-index: 2;
  user-select: none;
}

.subtitle{
  margin-right: 5px; flex: 1
}
.drop-down-frame {
  user-select: none;
  padding: 4px 12px;
  border-radius: 6px;
}

.drop-down-frame.active {
  background: #f9fafc;
}

.drop-down-list.right {
  right: 40px;
}

.drop-down-list.top {
  bottom: 20px;
}

.drop-down {
  position: relative;
}

.drop-down .item {
  font-size: 13.5px;
  list-style: none;
  padding: 10px 15px;
}

.item.add {
  font-weight: 700;
}

/*
.drop-down .item:hover{
    background-color: #dadada;
}*/
.drop-down .item.active {
  background-color: #cacaca;
}

.fade-appear-enter-active,
.fade-appear-leave-active {
  transition: all 0.12s ease-in;
}

.fade-appear-enter-from,
.fade-appear-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-appear-enter-to,
.fade-appear-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>