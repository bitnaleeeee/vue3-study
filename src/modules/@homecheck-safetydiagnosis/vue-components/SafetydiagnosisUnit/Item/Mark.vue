<template>
  <div class="safetydiagnosis-mark" :class="props.isActive ? 'active' : ''">
    <div
      class="transform-controller"
      :class="[props.type == pathShape.Point ? 'point' : '', props.isActive ? '' : 'no-border', props.type != pathShape.Circle && props.type != pathShape.Rect ? 'no-border' : '']"
    >
      <div
        class="transform-origin"
        :style="{
          transform: `rotate(${props.data.path.rotate}deg)`,
        }"
      >
        <Drag
          @touchstart="touchStart"
          :disabled="!props.isActive || !props.moveable"
          :delta="0"
          @dragstart="DragStart"
          @dragend="DragEnd"
          :data="props.data"
          class="figure-back area"
          ref="figure_back"
          v-if="props.type == pathShape.Rect || props.type == pathShape.Circle"
          :style="{
            width: `${props.data.path.width}px`,
            height: `${props.data.path.height}px`,
            left: `${props.data.path.left}px`,
            top: `${props.data.path.top}px`,

            clipPath: props.type == pathShape.Circle ? `ellipse(${props.data.path.width / 2}px ${props.data.path.height / 2}px)` : '',
          }"
        >
          <template v-slot:drag-image>
            <div class="dragging move">
              <div class="before"></div>
              <div class="after"></div>
            </div>
          </template>
        </Drag>
        <Drag
          v-else-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Line || props.type == pathShape.Arrow"
          :disabled="!props.isActive || !props.moveable"
          :delta="0"
          @touchstart="touchStart"
          @dragstart="DragStart"
          @dragend="DragEnd"
          :data="props.data"
          :style="{
            width: `${props.data.path.width}px`,
            left: `${props.data.path.left}px`,
          }"
          class="figure-back figure-double-arrow"
        >
          <div v-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Arrow" class="figure-arrow-start-top"></div>
          <div v-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Arrow" class="figure-arrow-start-center"></div>
          <div v-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Arrow" class="figure-arrow-start-bottom"></div>

          <div v-if="props.type == pathShape.DoubleArrow" :style="`left : calc(${props.data.path.width}px - var(--mark-body-size) * 2.5)`" class="figure-arrow-end-top"></div>
          <div v-if="props.type == pathShape.DoubleArrow" :style="`left : calc(${props.data.path.width}px - var(--mark-body-size) * 2.5)`" class="figure-arrow-end-bottom"></div>

          <div v-if="props.type == pathShape.DoubleArrow" :style="`left : calc(${props.data.path.width}px - var(--mark-body-size)/2)`" class="figure-arrow-end-center"></div>
          <template v-slot:drag-image>
            <div class="dragging move">
              <div class="before"></div>
              <div class="after"></div>
            </div>
          </template>
        </Drag>
        <Drag v-else :disabled="!props.isActive || !props.moveable" :delta="0" @touchstart="touchStart" @dragstart="DragStart" @dragend="DragEnd" :data="props.data" class="figure-back point">
          <template v-slot:drag-image>
            <div class="dragging move">
              <div class="before"></div>
              <div class="after"></div>
            </div>
          </template>
        </Drag>
      </div>

      <!--  style="z-index: -1" -->
      <div class="transform-origin" :style="[`transform : rotate(${props.data.path.rotate}deg);`]">
        <div
          class="border"
          style="pointer-events: none"
          :style="{
            left: props.type == pathShape.Point ? `` : `calc(${props.data.path.left}px - var(--transform-controller-border-width) * 2)`,
            top:
              props.type != pathShape.Circle && props.type != pathShape.Rect
                ? `calc(var(--transform-controller-border-size) / 2 * -1 - var(--transform-controller-border-width))`
                : `calc(${props.data.path.top}px - var(--transform-controller-border-size) / 4)`,
            width: props.type == pathShape.Point ? `0` : `calc(${props.data.path.width}px + var(--transform-controller-border-width) * 2)`,
            height:
              props.type != pathShape.Circle && props.type != pathShape.Rect
                ? `var(--transform-controller-border-size) `
                : `calc(${props.data.path.height}px + var(--transform-controller-border-width) * 2)`,
          }"
        >
          <div :class="[props.isActive && props.type != pathShape.Point ? '' : 'none']" class="transform-btn rotate" ref="figure_pt_rotate"></div>

          <div class="transform-btn left-top" :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" ref="figure_pt_lt"></div>
          <div :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" class="transform-btn top" ref="figure_pt_t"></div>

          <div :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" class="transform-btn right-top" ref="figure_pt_rt"></div>
          <div :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" class="transform-btn left" ref="figure_pt_l"></div>
          <div :class="[props.isActive && props.type != pathShape.Point ? 'block' : 'none']" class="transform-btn right" ref="figure_pt_r"></div>

          <div :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" class="transform-btn bottom-left" ref="figure_pt_lb"></div>
          <div :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" class="transform-btn bottom" ref="figure_pt_b"></div>
          <div :class="[props.isActive && (props.type == pathShape.Circle || props.type == pathShape.Rect) ? 'block' : 'none']" class="transform-btn bottom-right" ref="figure_pt_rb"></div>
        </div>
      </div>
      <div :class="props.isActive ? 'active' : ''" class="label">
        <div v-if="props.label.length > 0" style="display: flex; flex-direction: column; gap: 0.15rem">
          <div v-for="label of props.label" :key="label._id">
            {{ label.getTypeString() }}
          </div>
        </div>
        <div v-else>비어있음</div>
      </div>
    </div>

    <div class="mark-center" ref="mark_center"></div>
    <teleport v-if="isDragging" to=".dnd-ghost">
      <div
        class="transform-origin"
        :style="{
          transform: `scale(${props.scale}) translateY(calc( -1 * var(--calibrateY) / ${props.scale})) rotate(${props.data.path.rotate}deg)`,
        }"
      >
        <div
          v-if="props.type == pathShape.Rect || props.type == pathShape.Circle"
          class="figure-back area preview"
          :style="{
            width: `${props.data.path.width}px`,
            height: `${props.data.path.height}px`,
            left: `${props.data.path.left}px`,
            top: `calc(${props.data.path.top}px`,
            clipPath: props.type == pathShape.Circle ? `ellipse(${props.data.path.width / 2}px ${props.data.path.height / 2}px)` : '',
          }"
        ></div>
        <div
          v-else-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Line || props.type == pathShape.Arrow"
          :style="{
            width: `${props.data.path.width}px`,
            left: `${props.data.path.left}px`,
          }"
          class="figure-back figure-double-arrow preview"
        >
          <div v-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Arrow" class="figure-arrow figure-arrow-start-top"></div>
          <div v-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Arrow" class="figure-arrow figure-arrow-start-center"></div>
          <div v-if="props.type == pathShape.DoubleArrow || props.type == pathShape.Arrow" class="figure-arrow figure-arrow-start-bottom"></div>

          <div v-if="props.type == pathShape.DoubleArrow" :style="`left : calc(${props.data.path.width}px - var(--mark-body-size) * 2.5)`" class="figure-arrow figure-arrow-end-top"></div>
          <div v-if="props.type == pathShape.DoubleArrow" :style="`left : calc(${props.data.path.width}px - var(--mark-body-size) * 2.5)`" class="figure-arrow figure-arrow-end-bottom"></div>

          <div v-if="props.type == pathShape.DoubleArrow" :style="`left : calc(${props.data.path.width}px - var(--mark-body-size)/2)`" class="figure-arrow figure-arrow-end-center"></div>
        </div>
      </div>
    </teleport>

    <div
      v-if="rotating"
      class="rotate-guide-line vertical"
      :style="{
        transform: `rotate(${props.data.path.rotate - 180}deg) translateX(-50%)`,
      }"
    ></div>
    <div
      v-if="rotating"
      class="rotate-guide-line horizontal"
      :style="{
        transform: `rotate(${props.data.path.rotate - 180}deg) translateY(-50%)`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { useMouse } from "@vueuse/core";
import { useMousePressed } from "@vueuse/core";
import { Drag, Drop, DropMask } from "vue-easy-dnd";
import { pathShape } from "@/modules/@homecheck-safetydiagnosis/models/values/render";
import { nextTick, onMounted, onUnmounted, ref, watch, computed } from "vue";

const emits = defineEmits(["onDragChanged", "onMouseMove", "onDragStart"]);

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  scale: {
    type: Number,
    default: 1,
  },
  data: {
    path: {
      type: Object,
      default: {
        type: pathShape.Point,
        x: 300,
        y: 300,
        left: 250,
        top: 295,
        width: 100,
        height: 10,
        rotate: 0,
      },
    },
  },
  moveable: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "p",
  },
  label: {
    type: Array,
    default: [],
  },
});

const MinLimit = 15;

const mark_center = ref(null);
const shapedata = ref({});

const figure_back = ref(null);
const figure_pt_lt = ref(null);
const figure_pt_t = ref(null);
const figure_pt_rt = ref(null);
const figure_pt_l = ref(null);
const figure_pt_r = ref(null);
const figure_pt_lb = ref(null);
const figure_pt_b = ref(null);
const figure_pt_rb = ref(null);

const figure_pt_rotate = ref(null);

const DragTouched = ref(false);
const isDragging = ref(false);

const rotating = ref(false);

const rotatePressed = useMousePressed({ target: figure_pt_rotate });
const { x, y, sourceType } = useMouse({ target: figure_pt_rotate, type: "client" });

function DragStart() {
  if (!props.isActive) return;
  const center = getMarkCenter();
  emits("onDragStart", { x: center.x, y: center.y });
  isDragging.value = true;
  emits("onDragChanged", true);
}
function DragEnd() {
  isDragging.value = false;
  emits("onDragChanged", false);
}

function touchStart(e) {
  if (!props.isActive) return;
  emits("onDragChanged", true);
}

onMounted(() => {
  shapedata.value = { ...props.data.path };

  nextTick(() => {
    /*
    if (props.moveable == true) {
      initBackEvents();
    }
    */

    InitCtrlEvents("lt", figure_pt_lt.value);
    InitCtrlEvents("t", figure_pt_t.value);
    InitCtrlEvents("rt", figure_pt_rt.value);
    InitCtrlEvents("l", figure_pt_l.value);
    InitCtrlEvents("r", figure_pt_r.value);
    InitCtrlEvents("lb", figure_pt_lb.value);
    InitCtrlEvents("b", figure_pt_b.value);
    InitCtrlEvents("rb", figure_pt_rb.value);

    // InitRotateEvents();

    updateValue(shapedata.value);
  });
});

var RotatestartCursorPosX = 0;
var RotatestartCursorPosY = 0;
var RotateCenterX = 0;
var RotateCenterY = 0;
var RotateDiff = 0;
var StartRotate = 0;

var TotalDiff = 0;

function getMarkCenter() {
  const centerRect = mark_center.value.getBoundingClientRect();

  return {
    x: centerRect.left + centerRect.width / 2,
    y: centerRect.top + centerRect.height / 2,
  };
}

function onActiveMouseMove(path) {
  if (!props.isActive || !isDragging.value) return;
  emits("onMouseMove", path);
}

watch(
  () => y.value,
  (to, from) => {
    if (!props.isActive) return;
    onActiveMouseMove({ x: x.value, y: y.value });
  }
);
watch(
  () => x.value,
  (to, from) => {
    if (!props.isActive) return;
    onActiveMouseMove({ x: x.value, y: y.value });

    if (!rotatePressed.pressed.value) return;
    if (RotatestartCursorPosX == 0 && RotatestartCursorPosY == 0) {
      const center = getMarkCenter();
      RotatestartCursorPosX = to;
      RotatestartCursorPosY = y.value;
      RotateCenterX = center.x;
      RotateCenterY = center.y;
      TotalDiff = 0;
      StartRotate = 0;
      rotating.value = true;
    }

    let startData = shapedata.value;
    const data = { ...startData };
    //let angle = calcAngle(RotateCenterX, RotateCenterY, RotatestartCursorPosX, RotatestartCursorPosY, to, y.value);
    let angle = calcAngle(RotateCenterX, RotateCenterY, RotateCenterX, RotateCenterY - 100, to, y.value);

    /*
    if (RotatestartCursorPosX > RotateCenterX && to <= RotateCenterX) {
      angle = 180 + angle;
    } else if (RotatestartCursorPosX < RotateCenterX && to > RotateCenterX) {
      angle = 180 + angle;
    }
    */
    if (to <= RotateCenterX) {
      angle = 180 + angle;
    }
    if (StartRotate == 0) {
      data.rotate = angle;
      StartRotate = data.rotate;
    }
    const applyRotate = angle - RotateDiff;
    // 변경된 만큼만 rotate에 적용
    //    data.rotate += applyRotate;

    data.rotate = angle + 90;
    // 디버그용으로 변경사항 저장하기
    //  TotalDiff+= applyRotate
    //  RotateDiff = angle

    /*
    if (data.rotate > 360) {
      data.rotate -= 360;
    }

    if (data.rotate < (-1 * 360)){
      data.rotate += 360
    }

*/

    const snapTable = [0, 45, 90, 135, 180, 225, 270, 315, 360, 405, 450, 495];

    for (let snap of snapTable) {
      if (snap - 5 <= data.rotate && data.rotate <= snap + 5) {
        data.rotate = snap;
        break;
      }
    }

    updateValue(data);
  }
);

watch(
  () => rotatePressed.pressed.value,
  (to, from) => {
    RotatestartCursorPosX = 0;
    RotatestartCursorPosY = 0;
    RotateCenterX = 0;
    RotateCenterY = 0;
    RotateDiff = 0;
    if (!to) {
      rotating.value = false;
    }
  }
);

watch(
  () => props.type,
  (to, from) => {
    const data = { ...props.data.path };

    if (data.width == undefined || data.width == 0 || data.height == undefined || data.height == 0 || data.left == undefined || data.left == 0 || data.top == undefined || data.top == 0) {
      data.width = 100;
      data.height = 100;

      data.left = -50;

      data.top = -50;
      data.rotate = 0;
    }

    if (isLinear(to)) {
      data.left = 0;
    }
    nextTick(() => {
      updateValue(data, false);
    });
  }
);

function isLinear(type) {
  return type == pathShape.DoubleArrow || type == pathShape.Line || type == pathShape.Arrow;
}

function updateValue(value) {
  shapedata.value = value;
  props.data.setPathShape(value);
}

function rotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle;
  let cos = Math.cos(radians);
  let sin = Math.sin(radians);
  let nx = cos * (x - cx) + sin * (y - cy) + cx;
  let ny = cos * (y - cy) - sin * (x - cx) + cy;
  return { x: nx, y: ny };
}

function calcAngle(cx, cy, x1, y1, x2, y2) {
  if ((cx == x1 && cy == y1) || (cx == x2 && cy == y2)) return 0;

  let radian = Math.atan((y2 - cy) / (x2 - cx)) - Math.atan((y1 - cy) / (x1 - cx));
  let degree = Math.floor((180 / Math.PI) * radian);

  return degree;
}

function initBackEvents() {
  const back = figure_back.value;

  var backClicked = false;
  var startCursorPosX = 0;
  var startCursorPosY = 0;

  var startPosX = 0;
  var startPosY = 0;

  window.addEventListener("mousedown", (e) => {
    if (e.target != back) return;
    if (backClicked == true) return;
    backClicked = true;

    startCursorPosX = e.clientX;
    startCursorPosY = e.clientY;

    startPosX = shapedata.value.x;
    startPosY = shapedata.value.y;
  });

  window.addEventListener("mousemove", (e) => {
    if (backClicked == false) return;

    let diffX = e.clientX - startCursorPosX;
    let diffY = e.clientY - startCursorPosY;

    let newX = startPosX + diffX;
    let newY = startPosY + diffY;

    const data = { ...shapedata.value };
    data.x = newX;
    data.y = newY;
    data.left = data.x - data.width / 2;
    data.top = data.y - data.height / 2;
    updateValue(data);
  });

  window.addEventListener("mouseup", (e) => {
    backClicked = false;
  });
}
function InitCtrlEvents(tag, target) {
  var clicked = false;
  var current_tag = tag;
  var startCursorPosX = 0;
  var startCursorPosY = 0;

  var startData = shapedata.value;

  const downfunc = (e) => {
    if (e.target != target) return;
    if (clicked == true) return;

    clicked = true;
    startCursorPosX = e.clientX;
    startCursorPosY = e.clientY;

    if (e.touches != undefined) {
      startCursorPosX = e.touches[0].clientX;
      startCursorPosY = e.touches[0].clientY;
    }

    startData = shapedata.value;
    current_tag = tag;
  };

  const movefunc = (e) => {
    if (clicked == false) return;

    const data = { ...startData };

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches != undefined) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    let r = rotate(0, 0, clientX, clientY, data.rotate);
    let cx = r.x;
    let cy = r.y;

    let r2 = rotate(0, 0, startCursorPosX, startCursorPosY, data.rotate);
    let cx2 = r2.x;
    let cy2 = r2.y;

    let diffX = cx - cx2;
    let diffY = cy - cy2;

    const leftTopLimit = (value) => {
      return value > -1 * MinLimit ? -1 * MinLimit : value;
    };
    const widthHeightLimit = (value, limit = 0) => {
      if (limit == 0) {
        return value < MinLimit * 2 ? MinLimit * 2 : value;
      } else {
        return value < limit + MinLimit ? limit + MinLimit : value;
      }
    };

    // height은 top 을 포함하여 최소 거리 이상을 보장해야함
    // height값은 top 절대값 + 10 미만이 될 수 없음

    // 태그별 움직임 처리
    if (current_tag == "lt") {
      // 좌상
      data.left = isLinear(props.type) ? 0 : leftTopLimit(startData.left + diffX);
      data.top = leftTopLimit(startData.top + diffY);
      data.width = widthHeightLimit(startData.width - diffX, Math.abs(leftTopLimit(startData.left + diffX)));
      data.height = widthHeightLimit(startData.height - diffY, Math.abs(leftTopLimit(startData.top + diffY)));
    } else if (current_tag == "t") {
      // 상
      data.top = leftTopLimit(startData.top + diffY);
      data.height = widthHeightLimit(startData.height - diffY, Math.abs(leftTopLimit(startData.top + diffY)));
    } else if (current_tag == "rt") {
      // 우상
      data.top = leftTopLimit(startData.top + diffY);
      data.width = widthHeightLimit(startData.width + diffX, Math.abs(data.left));
      data.height = widthHeightLimit(startData.height - diffY, Math.abs(leftTopLimit(startData.top + diffY)));
    } else if (current_tag == "l") {
      //좌
      data.left = isLinear(props.type) ? 0 : leftTopLimit(startData.left + diffX);
      data.width = widthHeightLimit(startData.width - diffX, Math.abs(leftTopLimit(startData.left + diffX)));
    } else if (current_tag == "r") {
      // 우
      data.width = widthHeightLimit(startData.width + diffX, Math.abs(data.left));
    } else if (current_tag == "lb") {
      // 좌하
      data.left = isLinear(props.type) ? 0 : leftTopLimit(startData.left + diffX);
      data.width = widthHeightLimit(startData.width - diffX, Math.abs(leftTopLimit(startData.left + diffX)));
      data.height = widthHeightLimit(startData.height + diffY, Math.abs(data.top));
    } else if (current_tag == "b") {
      // 하
      data.height = widthHeightLimit(startData.height + diffY, Math.abs(data.top));
    } else if (current_tag == "rb") {
      // 우하
      data.height = widthHeightLimit(startData.height + diffY, Math.abs(data.top));
      data.width = widthHeightLimit(startData.width + diffX, Math.abs(data.left));
    }

    updateValue(data);
  };

  const upfunc = (e) => {
    if (clicked == true) {
      const data = { ...shapedata.value };
      // 돌아간 각도대로 센터값 재설정
      let _r = rotate(0, 0, data.left - data.x, data.top - data.y, data.rotate);
      let _r2 = rotate(0, 0, data.left + data.width - data.x, data.top + data.height - data.y, data.rotate);

      updateValue(data);
    }
    clicked = false;
  };

  target.addEventListener("mousedown", downfunc);
  window.addEventListener("mousemove", movefunc);
  window.addEventListener("mouseup", upfunc);

  window.addEventListener("touchstart", downfunc);
  window.addEventListener("touchmove", movefunc);
  window.addEventListener("touchend", upfunc);
}
function InitRotateEvents() {
  var clicked = false;
  var startCursorPosX = 0;
  var startCursorPosY = 0;

  var startData = shapedata.value;

  window.addEventListener("mousedown", (e) => {
    if (figure_pt_rotate.value != e.target) return;
    if (clicked == true) return;

    clicked = true;
    startCursorPosX = e.clientX;
    startCursorPosY = e.clientY;
    startData = shapedata.value;
  });

  window.addEventListener("mousemove", (e) => {
    if (clicked == false) return;

    const data = { ...startData };

    let angle = calcAngle(data.x, data.y, startCursorPosX, startCursorPosY, e.clientX, e.clientY);

    if (startCursorPosX > data.x && e.clientX <= data.x) {
      angle = 180 + angle;
    } else if (startCursorPosX < data.x && e.clientX > data.x) {
      angle = 180 + angle;
    }

    data.rotate += angle;

    if (data.rotate > 360) {
      data.rotate -= 360;
    }

    const snapTable = [0, 45, 90, 135, 180, 225, 270, 315];

    for (let snap of snapTable) {
      if (snap - 7 <= data.rotate && data.rotate <= snap + 7) {
        data.rotate = snap;
        break;
      }
    }

    updateValue(data);
  });

  window.addEventListener("mouseup", (e) => {
    clicked = false;
  });
}
</script>

<style scoped>
.dragging {
  position: absolute;
  display: none;
  opacity: 0.3;
  overflow: visible;
  top: calc(-100vw - var(--calibrateY));
}

.dragging.dnd-ghost {
  display: block !important;
  z-index: 10000 !important;
}

.dragging > span {
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 6px;
  margin: 25px 8px;
  color: #fff;
  white-space: nowrap;
}

.dragging:hover {
  opacity: 1;
}

.dragging:before,
.dragging:after {
  position: absolute;
  z-index: -1;
  left: -1px;
  top: calc(-200vw - var(--calibrateY));
  content: " ";
  height: 400vw;
  width: 2px;
  background: var(--mark-guideline);
}

.dragging:before {
  transform: rotate(90deg);
}

.dragging:after {
  transform: rotate(0deg);
}
</style>
