<template>
  <div class="board-wrap">
    <!-- 검색창 -->
    <div class="input-text-wrap">
      <input
        @keyup.enter="submit"
        v-model="textInput"
        type="text"
        class="input-text-form"
        placeholder="이름으로 검색하세요"
      />
      <button @click="submit" type="button" class="input-search-btn">
        검색
      </button>
    </div>

    <div class="content-wrap">
      <div class="content-box">
        <div class="table-box">
          <div class="table-top">
            <h2 class="table-title">사용자 정보</h2>
            <button class="table-title-btn">사용자 정보 수정</button>
          </div>

          <table class="table">
            <tr>
              <td>이름</td>
              <td>연락처</td>
              <td>주소</td>
              <td>이메일</td>
              <td>특이사항</td>
            </tr>
            <tr v-for="item in userInfo" :key="item">
              <td v-for="(value, index) in item" :key="index">{{ value }}</td>
            </tr>
          </table>
        </div>
        <div class="table-box">
          <div class="table-top">
            <h2 class="table-title">서비스 내역</h2>
          </div>
          <table class="table">
            <tr>
              <td>아파트 이름</td>
              <td>날짜</td>
              <td>주소</td>
              <td>주택점검</td>
              <td>결제필요</td>
              <td>결제인증</td>
              <td>예약확정</td>
              <td>특이사항</td>
            </tr>
            <tr v-for="item in serviceInfo" :key="item">
              <td v-for="(value, index) in item" :key="index">{{ value }}</td>
            </tr>
          </table>
        </div>
        <div class="table-box">
          <div class="table-top">
            <h2 class="table-title">상담내역</h2>
          </div>
          <table class="table">
            <tr>
              <td>날짜</td>
              <td>고객 행동</td>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>-</td>
              <td>-</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="content-box">
        <div class="tab-wrap">
          <div class="tab-btn">
            <button type="button" class="on">서비스 내역</button>
            <button type="button">상담내역</button>
          </div>
          <div class="tab-content">
            <textarea class="textarea"></textarea>
            <button type="button" class="tab-content-btn">등록</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <h1>{{ msg }}</h1> -->
  </div>
</template>

<script setup>
import { ref } from "vue";

const userInfo = [
  ["홍길동", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길송", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길봉", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길동", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담완료"],
  ["홍길롱", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길통", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길몽", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길콩", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
  ["홍길통", "010-1234-5678", "힐스테이트자이계양", "2023-12-24", "상담대기"],
];

const serviceInfo = [
  ["홍길동", "010-", "자이계양", "224", "상담대기", "완료", "예약", "메모"],
  ["홍길동", "010-", "자이계양", "24", "상담대기", "완료", "예약", "메모"],
  ["홍길동", "010-", "자이계양", "24", "상담대기", "완료", "예약", "메모"],
];

const textInput = ref("");

function submit() {
  if (textInput.value !== "홍길동") {
    alert(textInput.value + "를 추가할까요?");
  }
}
</script>

<style scoped>
.board-wrap {
  padding: 20px;
}

.input-text-wrap {
  position: relative;
  box-sizing: border-box;
  padding-right: 80px;
}

.input-text-wrap .input-text-form {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
}

.input-text-wrap .input-search-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 75px;
  height: 40px;
  border: 1px solid #999;
  background-color: #e0e0e0;
}

.content-wrap {
  margin-top: 20px;
}

.content-wrap::after {
  content: "";
  display: block;
  clear: both;
}

.content-wrap .content-box {
  float: left;
  width: 47.5%;
}
.content-wrap .content-box:last-child {
  margin-left: 5%;
}

.table-box {
  position: relative;
  margin-top: 20px;
}

.table-box .table-title {
  font-size: 20px;
}

.table-box .table-title-btn {
  position: absolute;
  top: 0;
  right: 0;
  height: 30px;
  border: 1px solid #999;
  background-color: #e0e0e0;
}

.table-box .table {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-spacing: 0;
  width: 100%;
}

.table-box .table td {
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 5px 10px;
}

.table-box .table td:last-child {
  border-right: 1px solid #ccc;
}

.table-box .table tr:last-child td {
  border-bottom: none;
}

.tab-wrap {
  margin-top: 20px;
}
.tab-wrap .tab-btn > button {
  width: 50%;
  height: 35px;
  border: 1px solid #999;
  background-color: #f0f0f0;
  cursor: pointer;
}
.tab-wrap .tab-btn > button:hover {
  background: #e0e0e0;
}
.tab-wrap .tab-btn > button.on {
  background: #ccc;
}
.tab-wrap .tab-content {
  margin-top: 10px;
}
.tab-wrap .tab-content .textarea {
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  resize: none;
}
.tab-wrap .tab-content .tab-content-btn {
  margin-top: 10px;
  width: 100%;
  height: 35px;
  border: 1px solid #999;
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
