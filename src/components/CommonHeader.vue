<template>
  <div class="header-wrap">
    <div class="left-wrap">
      <div style="margin-right: 5px">Google 정보</div>
      <div>스토어</div>
    </div>

    <div class="right-wrap">
      <div style="margin-right: 5px">Gmail</div>
      <div>이미지</div>
    </div>
  </div>
</template>

<script setup></script>

<style>
.header-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  height: 80px;
}

.header-wrap .left-wrap {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
}

.header-wrap .right-wrap {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
