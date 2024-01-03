<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    :class="[type ? type : '']"
  >
    <slot />
  </transition>
</template>
<script>
export default {
  name: "TransitionExpand",
  props : ['type'],
  methods: {
    enter(element) {
      const width = getComputedStyle(element).width;

      element.style.width = width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";

      const height = getComputedStyle(element).height;

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      // Trigger the animation.
      // We use `requestAnimationFrame` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
    leave(element) {
      const height = getComputedStyle(element).height;

      element.style.height = height;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    },
  },
};
</script>
<style scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
.expand-enter-active {
  transition: all 0.22s ease;
  overflow: hidden;
  opacity: 1;
}

.expand-leave-active {
  transition: all 0.175s ease;
  overflow: hidden;
  opacity: 0;
}
.late.expand-enter-active {
  transition: all 0.45s ease;
  overflow: hidden;
  opacity: 1;
}

.late.expand-leave-active {
  transition: all 0.35s ease;
  overflow: hidden;
  opacity: 0;
}


.expand-enter,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>