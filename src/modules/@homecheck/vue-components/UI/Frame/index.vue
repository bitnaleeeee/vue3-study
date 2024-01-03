<template>
  <div
    class="UIFrame common-border-8"
    :class="[type ? type : '', option.nopadding == true ? 'no-padding' : '']"
  >
    <slot />
  </div>
</template>
<script>
export default {
  props: ["type", "options"],
  computed: {
    option() {
      return this.options ? this.options : {};
    },
  },
};
</script>
<style scoped>
.UIFrame {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  margin: 10px 20px 20px;
  padding: 20px;
  height: fit-content;
}
.UIFrame.no-padding {
  padding: 0px;
}

.primary {
  /*background-image: linear-gradient(238deg, #8941e4, #6153fb);*/
background: var(--primary-gradient);
}

.common-border-8{
    border-radius: 8px;
}

</style>