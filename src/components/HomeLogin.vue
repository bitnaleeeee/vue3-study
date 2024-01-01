<template>
  <div @click="closeSearch" class="contet-wrap">
    <div class="title-content">Googgle</div>
    <div class="search-wrap">
      <input @click="toggleClass" class="serarch-bar" type="text" />
      <div v-if="commmandList" class="command-search">
        <h5>인기 급상승 검색어</h5>
        <ul>
          <li>토트넘 사르 부상</li>
          <li>토트넘 손흥민 골</li>
          <li>야마토 타케루 페그 오</li>
          <li>갑진년 좋은 띠</li>
          <li>갑진년 띠별 운세</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

onMounted(() => {
  setCateList();
});

const commmandList = ref(false);

const setCateList = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/data/data.json`);
    console.log(res.data);
  } catch (err) {
    console.log("에러");
  }
};

function toggleClass() {
  commmandList.value = true;
}

function closeSearch(e) {
  if (e.target.className === "serarch-bar") {
    return false;
  }
  commmandList.value = false;
}
</script>

<style>
.contet-wrap .title-content {
  text-align: center;
  font-size: 80px;
  font-weight: bold;
  margin-bottom: 20px;
}

.contet-wrap .search-wrap {
  text-align: center;
}
.contet-wrap .search-wrap .serarch-bar {
  width: 300px;
  border-radius: 10px;
  height: 30px;
  width: 525px;
  border-color: #303134;
}

.contet-wrap .search-wrap .serarch-bar:focus {
  border-color: #303134;
  outline: none;
}

.contet-wrap .search-wrap .command-search {
  margin: 0 auto;
  width: 525px;
  height: 500px;
  border: 1px solid #303134;
  background-color: #303134;
  color: #ffff;
  border-radius: 10px;
  border-color: #303134;
  text-align: left;
}

.contet-wrap .search-wrap .command-search h5 {
  margin: 10px 0;
}

.contet-wrap .search-wrap .command-search ul {
  padding-left: 20px;
}

.contet-wrap .search-wrap .command-search ul li {
  line-height: 1.5;
  cusor: pointer;
}
</style>
