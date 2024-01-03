<template>
  <div class="user-info-wrap">
    <div class="left">
      <!-- 검색창 인풋박스 -->
      <div class="search-container">
        <input
          class="search-input"
          type="text"
          @keyup.enter="handleEnter"
          @keydown="handleArrowDown"
          v-model="searchText"
          @input="userSearch"
          placeholder="성명 또는 전화번호로 검색해주세요"
        />
        <i
          type="text"
          style="
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            font-size: 1.5rem;
            color: #555;
          "
          class="bx bx-search-alt-2"
        ></i>
        <div
          v-bind:class="{
            'search-wrap': isText,
            'search-wrap-hidden': !isText,
          }"
        >
          <div class="inner-style">
            <ul v-if="isText">
              <li
                class="info-wrap-data"
                v-for="(service, index) in services"
                :key="index"
                v-bind:class="{ selected: index === selectedRowIndex }"
                @click="clickUser(services, index)"
              >
                [서비스] 서비스명: {{ service.name }}, 담당자:
                {{ service.manager }}, 연락처: {{ service.contact }}
              </li>
              <li
                @click="newUserInfo"
                class="info-search-data"
                v-bind:class="{ selected: 6 === selectedRowIndex }"
              >
                <strong>{{ searchText }}</strong> 으로 새 고객 추가하기
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 검색창 하단 동적 클래스 -->
      <div>
        <!-- 홈페이지 유입 고객 리스트 테이블  -->
        <div v-if="newUser" class="reservation-table">
          <table class="table-wrap">
            <thead class="table-header">
              <tr>
                <th
                  class="table-cell"
                  v-for="(header, headerIndex) in tableHeaders"
                  :key="headerIndex"
                >
                  <template v-if="headerIndex === tableHeaders.length - 2">
                    <div>
                      <select v-model="selectedFilter">
                        <option value="">상담상태</option>
                        <option
                          v-for="status in uniqueStatuses"
                          :key="status"
                          :value="status"
                        >
                          {{ status }}
                        </option>
                      </select>
                    </div>
                  </template>
                  <template v-else>
                    {{ header }}
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                @click="selectedData(row)"
                v-for="(row, rowIndex) in displayedTableData"
                :key="rowIndex"
              >
                <td
                  class="table-cell-style"
                  v-for="(cell, cellIndex) in Object.values(row || {})"
                  :key="cellIndex"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="btn-cover">
            <button
              :disabled="pageNum === 0"
              @click="pageNum--"
              class="page-btn"
            >
              이전
            </button>
            <span class="page-count"
              >{{ pageNum + 1 }} / {{ pageCount }} 페이지</span
            >
            <button
              :disabled="pageNum >= pageCount - 1"
              @click="pageNum++"
              class="page-btn"
            >
              다음
            </button>
          </div>
        </div>
        <!-- 고객 정보 추가 테이블 -->
        <div v-else class="new-user-table">
          <div class="user-info-read-wrap">
            <!-- 고객 인적 정보 -->
            <div class="customer-info-container">
              <h4>고객 정보</h4>
              <div class="user-id-card">
                <label>
                  <i
                    class="bx bx-user"
                    style="margin-right: 0.5rem; vertical-align: middle"
                  ></i>
                  <input
                    v-model="selectedUserName"
                    style="border: none"
                    placeholder="성명"
                  />
                </label>
                <label>
                  <i
                    class="bx bx-user"
                    style="margin-right: 0.5rem; vertical-align: middle"
                  ></i>
                  <input
                    v-model="selectedUserPhone"
                    style="border: none"
                    placeholder="연락처1"
                  />
                </label>
                <label>
                  <i
                    class="bx bx-user"
                    style="margin-right: 0.5rem; vertical-align: middle"
                  ></i>
                  <input style="border: none" placeholder="연락처2" />
                </label>
                <label>
                  <textarea placeholder="특이사항"></textarea>
                </label>
              </div>
            </div>
            <!-- 서비스내역정보-->
            <div class="services_container">
              <h4>서비스 내역</h4>
              <div class="service_card">
                <div class="card-wrap">
                  <div class="card-inner">
                    <div class="info-year">2023</div>
                    <div class="info-day">12 / 15</div>
                    <div class="info-time">10:00 - 11:30</div>
                  </div>
                  <div class="service-wrap">
                    <div class="service-wrap-inner">
                      <div class="service-wrap-text">스마트</div>
                      <div class="sort-step">
                        <div class="sort-step-head"></div>
                        <div class="sort-step-text">예약 상담</div>
                      </div>
                    </div>
                    <div class="user-address">203동 1306호</div>
                    <div class="user-apart">힐스테이트리슈빌강일포레스트힐</div>
                  </div>
                </div>
              </div>
              <div class="service_card">
                <div class="card-wrap">
                  <div class="card-inner">
                    <div class="info-year">2023</div>
                    <div class="info-day">12 / 15</div>
                    <div class="info-time">10:00 - 11:30</div>
                  </div>
                  <div class="service-wrap">
                    <div class="service-wrap-inner">
                      <div class="service-wrap-text">스탠다드</div>
                      <div class="sort-step">
                        <div class="sort-step-head"></div>
                        <div class="sort-step-text">예약 확정</div>
                      </div>
                    </div>
                    <div class="user-address">203동 1306호</div>
                    <div class="user-apart">힐스테이트리슈빌강일포레스트힐</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="service_logs_container">
              <h4>서비스 로그</h4>

              <div
                class="service-logs-card"
                v-for="(data, index) in serviceLog"
                :key="index"
              >
                <div class="logs-card-menu">예약 상담</div>
                <div class="logs-card-text-wrap">
                  <div class="logs-card-text">
                    {{ data.serviceLogInfo }}
                  </div>
                  <div class="logs-card-time">
                    {{ data.serviceLogDate }}
                    <!-- {{ new Date().toLocaleDateString() }} -->
                    <!-- {{ new Date().toLocaleTimeString() }} -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2번째 렌더링 상담 입력 폼 -->
          <div class="userInfoUpdate">
            <h4>상담 일지</h4>
            <div class="info-write-form">
              <button
                v-for="button in [
                  '예약 확정',
                  '예약 상담',
                  '부재',
                  '예약 변경',
                  '상담 대기',
                  '상담 완료',
                ]"
              >
                {{ button }}
              </button>
              <label>
                <i class="bx bx-search"></i>
                <input />
              </label>
              <select
                v-model="selectedOption"
                name="form_wrap"
                class="select-form"
              >
                <option value="" selected>입력폼을 선택하세요!</option>
                <option value="service_log">서비스내역</option>
                <option value="consulting_log">안전진단 상담</option>
              </select>
              <div :class="{ visible: selectedOption === '' }">
                <!-- 서비스내역상담 -->
                <div
                  :class="{ 'service-log': selectedOption === 'service_log' }"
                  v-if="selectedOption === 'service_log'"
                >
                  <div>
                    <h4>아파트</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>동</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>호수</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>평형/타입</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>신청 서비스</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>문의 내용</h4>
                    <textarea
                      class="log-text"
                      v-model="areaText"
                      @input="areaSearch"
                      rows="10"
                    ></textarea>
                  </div>
                </div>
                <!-- 안전진단상담 -->
                <div
                  :class="{
                    'consulting-log': selectedOption === 'consulting_log',
                  }"
                  v-if="selectedOption === 'consulting_log'"
                >
                  <div>
                    <h4>지역</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>담당자</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>건축물 명칭</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>건축물 주소</h4>
                    <input class="log-text" />
                  </div>
                  <div>
                    <h4>문의 내용</h4>
                    <textarea
                      @input="textValueEvent"
                      class="log-text"
                      rows="10"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="button_wrap">
              <button class="form_button" @click="backPage">되돌아가기</button>
              <button class="form_button" @click="saveConfirm">저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { debounce } from "lodash";
import { useMagicKeys } from "@vueuse/core";

// import { onMounted } from 'vue';
// import axios from "axios";

// const titleList = ref([]);

// onMounted(() => {
//   setData();
// });

// const setData = async () => {
//   try {
//     const res = await axios.get(`http://localhost:7002/homecheck/web/data.json`);
//     titleList.value = res.data;
//   } catch (err) {
//     console.log("에러");
//   }
// };

//데이터 통신

const { shift, space, a } = useMagicKeys();

const textValue = ref("");
const searchText = ref("");
const searchValue = ref("");
const selectedFilter = ref("");
const areaText = ref("");

const pageNum = ref(0);
const itemsPerPage = ref(25);
const selectedRowIndex = ref(0);

const reservationUser = ref("");

const selectedUserName = ref("");
const selectedUserPhone = ref("");

const enterUserName = ref("");
const enterUserPhone = ref("");

const sections = [
  { title: "고객 정보", value: "내용1" },
  { title: "고객 행동 내역", value: "내용2" },
  { title: "고객 행동 입력", value: "내용3" },
];

const serviceLog = ref([
  {
    serviceLogInfo: "상담내용1",
    serviceLogDate: 20240103121556,
  },
  {
    serviceLogInfo: "상담내용2",
    serviceLogDate: 20240103121650,
  },
  {
    serviceLogInfo: "상담내용3",
    serviceLogDate: 20240103121756,
  },
]);

const setDateFormat = (log) => {
  const dateStr = String(log.serviceLogDate);
  const year = dateStr.substr(0, 4);
  const month = dateStr.substr(4, 2);
  const day = dateStr.substr(6, 2);
  const hour = dateStr.substr(8, 2);
  const time = dateStr.substr(10, 2);

  log.serviceLogDate = `${year}-${month}-${day} ${hour}:${time}`;
};

const dateFilter = () => {
  serviceLog.value.sort((a, b) => b.serviceLogDate - a.serviceLogDate);
  serviceLog.value.forEach(setDateFormat);
};
// 날짜 내림차순 정렬

dateFilter();

const tableData = ref([
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담완료",
    담당직원: "김둘리",
  },
  {
    name: "이짱구",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담완료",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담완료",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담완료",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담완료",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
  ,
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },

  ,
  {
    name: "이짱구",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },

  ,
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },

  ,
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },

  ,
  {
    name: "홍길동",
    phone: "010-1234-5678",
    apart: "힐스테이트 자이 계양",
    신청일: "2023-12-24",
    상담상태: "상담대기",
    담당직원: "김둘리",
  },
]);

const filterOptions = {
  showAll: true,
  statusFilter: "",
};

const tableHeaders = [
  "이름",
  "휴대폰",
  "아파트",
  "신청날짜",
  "상담상태",
  "담당자",
];

const services = [
  { name: "서비스A", manager: "홍길동", contact: "010-1234-5678" },
  { name: "서비스B", manager: "홍길동", contact: "010-1234-5678" },
  { name: "서비스C", manager: "홍길동", contact: "010-1234-5678" },
  { name: "서비스D", manager: "홍길동", contact: "010-1234-5678" },
  { name: "서비스E", manager: "홍길동", contact: "010-1234-5678" },
  { name: "서비스F", manager: "홍길동", contact: "010-1234-5678" },
];

const clickUser = (services, index) => {
  const selectedUser = services[index];
  selectedUserName.value = selectedUser.name;
  newUser.value = false;
  searchText.value = "";
  isText.value = false;
};

// 추천 검색어 클릭시 실행되는 함수 (선택 고객 성함,전화번호 렌더링)

const newUser = ref(true);
const isText = ref(false);
const filterAllRows = ref(false);
const selectedOption = ref("");

const selectedData = (selectedRow) => {
  if (selectedRow) {
    selectedUserName.value = selectedRow.name;
    selectedUserPhone.value = selectedRow.phone;
  }
  newUser.value = false;
  isText.value = false;
};
// 테이블 클릭시 테이블 이동 > 선택자 이름, 전화번호 출력

const handleEnter = () => {
  if (selectedRowIndex.value === 0) {
    selectedUserName.value = services[0].name;
    selectedUserPhone.value = services[0].contact;
  } else if (selectedRowIndex.value < 6) {
    newUser.value = false;
    searchText.value = "";
    isText.value = false;
    textValue.value = searchText.value;
    selectedUserName.value = enterUserName.value;
    selectedUserPhone.value = enterUserPhone.value;
  } else if (selectedRowIndex.value === 6 && textValue.value !== "홍길동") {
    alert("일치하는 정보가 없습니다. 추가하시겠습니까?");
    selectedUserName.value = searchText.value;
    selectedUserPhone.value = "";
  }
  newUser.value = false;
  searchText.value = "";
  isText.value = false;
  selectedRowIndex.value = 0;
};

// 추천 검색어 엔터, 새고객 추가 엔터시 실행 함수

const handleArrowDown = (event) => {
  console.log(selectedRowIndex.value);
  if (event.key === "ArrowDown") {
    if (selectedRowIndex.value < services.length) {
      const num = selectedRowIndex.value + 1;

      if (num < 5) {
        enterUserName.value = services[num].name;
        enterUserPhone.value = services[num].contact;
      } else {
        enterUserName.value = searchText.value;
        enterUserPhone.value = "";
      }
      selectedRowIndex.value += 1;
    }
  } else if (event.key === "ArrowUp") {
    console.log(selectedRowIndex.value);
    if (selectedRowIndex.value > 0) {
      const num = selectedRowIndex.value - 1; // 수정된 부분
      enterUserName.value = services[num].name;
      enterUserPhone.value = services[num].contact;
      selectedRowIndex.value -= 1;
    }
  }
};

// 검색창 하단 인덱스 배경색 css

const newUserInfo = () => {
  selectedUserName.value = searchText.value;

  selectedUserPhone.value = "";

  newUser.value = false;
  searchText.value = "";
  isText.value = false;
};

// 새고객 추가하기 클릭시 실행함수

const userSearch = debounce(() => {
  if (searchText.value) {
    isText.value = true;
  } else {
    isText.value = false;
  }
}, 500);

//검색창 입력시 실행 함수

const backPage = () => {
  newUser.value = true;
};

// 메인 되돌아가기 버튼

const saveConfirm = () => {
  alert("저장이 완료되었습니다");
};

const uniqueStatuses = computed(() => {
  const statusHeader = "상담상태";
  return Array.from(new Set(tableData.value.map((row) => row[statusHeader])));
});

// 필터링 함수

const pageCount = computed(() => {
  return Math.ceil(tableData.value.length / itemsPerPage.value);
});

//페이지네이션

const displayedTableData = computed(() => {
  const statusHeader = "상담상태";

  let filteredData = tableData.value;

  if (selectedFilter.value) {
    filteredData = tableData.value.filter(
      (row) => row[statusHeader] === selectedFilter.value
    );
  }
  const startIndex = pageNum.value * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredData.slice(startIndex, endIndex);
});

//상담상태 필터링
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
}

.user-info-wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #f3f5f9;
}

.user-info-wrap .left {
  flex-basis: 70%;
  flex: 1;
  grid-template-rows: min-content min-content 1fr;
  grid-template-columns: max-content 1fr;
}

.user-info-wrap .left .search-container {
  width: 100%;
  grid-row: 1/2;
  grid-column: 1/3;
  position: relative;
  margin: 23px 0;
}

.user-info-wrap .left .search-container .search-input {
  width: 80%;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-left: 50px;
  font-size: 20px;
}

.user-info-wrap .left .search-container .search-input::placeholder {
  font-size: 17px;
}

.user-info-wrap .left .search-container .search-wrap {
  position: fixed;
  z-index: 999;
  width: 38.2%;
  overflow: hidden;
  background: #fff;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  box-sizing: border-box;
  border-radius: 5px;
}

.user-info-wrap .left .search-container .search-wrap-hidden {
  display: block;
}

.user-info-wrap .left .search-container .search-wrap .inner-style {
  padding-bottom: 8px;
  flex: auto;
  overflow-x: hidden;
}

.user-info-wrap
  .left
  .search-container
  .search-wrap
  .inner-style
  .info-wrap-data {
  list-style-type: none;
  padding: 3px 0.2rem;
  font-size: 17px;
  line-height: 1.6;
  cursor: pointer;
  margin: 0 20px 0 14px;
}

.user-info-wrap .left .search-container .search-wrap .inner-style .selected {
  cursor: pointer;
  background-color: #f3f5f9;
}

.user-info-wrap
  .left
  .search-container
  .search-wrap
  .inner-style
  .info-search-data {
  list-style-type: none;
  padding: 0.2rem;
  font-size: 20px;
  line-height: 1.6;
  margin: 0 20px 0 14px;
  cursor: pointer;
}

.user-info-wrap .left .reservation-table {
  width: 93%;
}

.user-info-wrap .left .reservation-table .table-wrap {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.user-info-wrap .left .reservation-table .table-wrap .table-header {
  background-color: #f2f2f2;
}

.user-info-wrap .left .reservation-table .table-wrap .table-header .table-cell {
  font-size: 15px;
}

.user-info-wrap
  .left
  .reservation-table
  .table-wrap
  .table-header
  .table-cell
  select {
  background-color: #f2f2f2;
  font-size: 15px;
  color: #6c7785;
  font-weight: 700;
  border: none;
}

.user-info-wrap .left .reservation-table .table-wrap .table-header tr th {
  color: #6c7785;
  border: 1px solid #ddd;
  padding: 8px;
}

.user-info-wrap .left .reservation-table .table-wrap tr td {
  padding: 0.7rem 0;
}

.user-info-wrap .left .reservation-table .table-wrap .table-cell-style {
  cursor: pointer;
  text-align: center;
  border: 1px solid #ddd;
  padding: 8px;
}

.user-info-wrap .left .reservation-table .table-wrap .table-cell-style:hover {
  background-color: #fbfafe;
}

.user-info-wrap .left .reservation-table .btn-cover {
  margin-top: 1.5rem;
  text-align: center;
}

.user-info-wrap .left .reservation-table .btn-cover .page-btn {
  width: 5rem;
  height: 2rem;
  letter-spacing: 0.5px;
}

.user-info-wrap .left .reservation-table .btn-cover .page-count {
  padding: 0 1rem;
}

.user-info-wrap .left .new-user-table {
  display: flex;
}

.user-info-wrap .left .new-user-table .user-info-read-wrap {
  display: flex;
  flex-direction: column;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .customer-info-container {
  grid-row: 2/3;
  grid-column: 1/2;
  padding: 1rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .customer-info-container
  h4 {
  color: #bbbbbb;
  margin-bottom: 1rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .customer-info-container
  .user-id-card {
  background-color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
  box-shadow: 1px 1px 8px 2px rgba(100, 100, 100, 0.07);
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .customer-info-container
  .user-id-card
  label {
  border-radius: 10px;
  box-shadow: 1px 1px 2px 1px rgba(100, 100, 100, 0.1);
  display: inline-block;
  padding: 2px 10px;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .customer-info-container
  .user-id-card
  label
  textarea {
  border: none;
}

.user-info-wrap .left .new-user-table .user-info-read-wrap .services_container {
  padding: 1rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  h4 {
  color: #bbbbbb;
  margin-bottom: 1rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card {
  background-color: white;
  position: relative;
  display: flex;
  margin-bottom: 1rem;
  flex-direction: column;
  border-left: 4px solid #ff9100;
  padding: 10px 1rem;
  border-radius: 10px;
  box-shadow: 1px 1px 8px 2px rgba(100, 100, 100, 0.07);
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .card-wrap {
  display: flex;
  gap: 1rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .card-inner {
  border-right: 1px solid #ddd;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  position: relative;
  line-height: 1.6;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .card-inner
  .info-year {
  text-align: left;
  font-size: 0.7rem;
  color: #aaa;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .card-inner
  .info-day {
  font-size: 1.2rem;
  font-weight: 600;
  color: #aaa;
  text-align: center;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .card-inner
  .info-time {
  font-size: 0.8rem;
  text-align: center;
  color: #888;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .service-wrap-inner {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .service-wrap-inner
  .service-wrap-text {
  font-size: smaller;
  color: #ff9100;
  display: inline-block;
  width: fit-content;
  right: 1rem;
  top: 10px;
  border: 1px solid #ff9100;
  border-radius: 5px;
  padding: 2px 4px;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .service-wrap-inner
  .sort-step {
  flex-grow: 1;
  border: 1px solid rgba(255, 145, 0, 0.19);
  position: relative;
  background-color: transparent;
  border-radius: 4px;
  overflow: hidden;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .service-wrap-inner
  .sort-step
  .sort-step-head {
  position: absolute;
  width: 60%;
  background-color: rgba(221, 221, 221, 0.37);
  content: " ";
  height: 100%;
  top: 0;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .service-wrap-inner
  .sort-step
  .sort-step-text {
  display: inline-block;
  width: 100%;
  z-index: 1;
  background-color: transparent;
  position: relative;
  text-align: center;
  color: #ff9100;
  font-size: 0.8rem;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .user-address {
  font-weight: 500;
  font-size: 1rem;
  color: #aaa;
  text-align: right;
}

.user-info-wrap
  .left
  .new-user-table
  .user-info-read-wrap
  .services_container
  .service_card
  .service-wrap
  .user-apart {
  max-width: 100%;
  color: #333;
}

.user-info-wrap .left .service_logs_container {
  grid-row: 2/4;
  grid-column: 2/3;
  padding: 0 1rem;
}

.user-info-wrap .left .service_logs_container h4 {
  color: #bbbbbb;
}

.user-info-wrap .left .service_logs_container .service-logs-card {
  display: flex;
  border-radius: 1rem;
  overflow: hidden;
  gap: 4px;
  margin-bottom: 0.5rem;
  box-shadow: 1px 1px 8px 2px rgba(100, 100, 100, 0.07);
}

.user-info-wrap
  .left
  .service_logs_container
  .service-logs-card
  .logs-card-menu {
  background-color: whitesmoke;
  flex-basis: 6rem;
  padding: 1rem;
  text-align: center;
  color: #3c97ffff;
  flex-shrink: 0;
  font-weight: 600;
}

.user-info-wrap
  .left
  .service_logs_container
  .service-logs-card
  .logs-card-text-wrap {
  background-color: white;
  flex-grow: 1;
  padding: 1rem;
  position: relative;
}

.user-info-wrap
  .left
  .service_logs_container
  .service-logs-card
  .logs-card-text-wrap
  .logs-card-text {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.user-info-wrap
  .left
  .service_logs_container
  .service-logs-card
  .logs-card-text-wrap
  .logs-card-time {
  color: #bbbbbb;
  font-size: 0.7rem;
  text-align: right;
}

.user-info-wrap .left .new-user-table .new-user-form-wrap {
  display: flex;
  flex-direction: column;
}

.user-info-wrap .left .userInfoUpdate {
  width: 100%;
}

.user-info-wrap .left .userInfoUpdate h4 {
  color: #bbbbbb;
  margin-left: 11px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.user-info-wrap .left .userInfoUpdate .info-write-form {
  width: 90%;
  height: 94%;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 1px 1px 8px 2px rgba(100, 100, 100, 0.07);
  padding: 0.2rem;
}

.user-info-wrap .left .userInfoUpdate .info-write-form button {
  cursor: pointer;
}

.user-info-wrap .left .userInfoUpdate .visible {
  display: none;
}

.user-info-wrap .left .userInfoUpdate .info-write-form button {
  display: inline-block;
  margin-right: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  min-width: 4rem;
  background-color: white;
  border: 1px solid #2c7ad2;
  color: #2c7ad2;
}

.user-info-wrap .left .userInfoUpdate .info-write-form label {
  display: inline-block;
  position: relative;
  width: 100%;
}

.user-info-wrap .left .userInfoUpdate .info-write-form label i {
  position: absolute;
  top: 61%;
  font-size: 20px;
  left: 0.5rem;
  transform: translate(0, -50%);
}

.user-info-wrap .left .userInfoUpdate .info-write-form label input {
  border-radius: 10px;
  height: 48px;
  width: 100%;
  border: none;
  box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  text-indent: 1.5rem;
  margin-top: 1.1rem;
  font-size: 15px;
}

.user-info-wrap .left .userInfoUpdate .info-write-form .select-form {
  width: 100%;
  background-color: F5F5F5;
  height: 46px;
  border-bottom: 1px solid #ccc;
  margin-top: 3.2rem;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}

.user-info-wrap .left .userInfoUpdate .info-write-form .service-log {
  background-color: #f3f5f9;
  border-radius: 10px;
  padding: 1rem;
}

.user-info-wrap .left .userInfoUpdate .info-write-form .service-log h4 {
  color: #999;
  font-weight: 500;
}

.user-info-wrap .left .userInfoUpdate .info-write-form .service-log .log-text {
  width: 100%;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 0 rgba(100, 100, 100, 0.1);
  border-radius: 2px;
}

.user-info-wrap .left .userInfoUpdate .info-write-form .consulting-log {
  background-color: #f3f5f9;
  border-radius: 10px;
  padding: 1rem;
}

.user-info-wrap .left .userInfoUpdate .info-write-form .consulting-log h4 {
  color: #999;
  margin-bottom: 1rem;
  font-weight: 500;
}

.user-info-wrap
  .left
  .userInfoUpdate
  .info-write-form
  .consulting-log
  .log-text {
  width: 100%;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 0 rgba(100, 100, 100, 0.1);
  border-radius: 2px;
}

.user-info-wrap .left .button_wrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 3rem;
}

.user-info-wrap .left .button_wrap .form_button {
  margin-right: 0.5rem;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #2c7ad2;
  color: #2c7ad2;
  width: 114px;
  height: 38px;
  cursor: pointer;
}
</style>
