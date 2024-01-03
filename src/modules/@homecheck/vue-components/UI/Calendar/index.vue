<template>
<div class="calendar common-side-margin common-border common-border-8">
<div class="title">

<div v-if="!type || type =='default'" class="default">
    <a @click="prevMonth()">
    <img class="icon-forward" />
    </a>
<span class="year">{{modelValue.getFullYear()}}</span>
<span class="month">{{ addZero((modelValue.getMonth() + 1) )   }}</span>    
<a @click="nextMonth()">
<img class="icon-forward rotate-180" />
</a>
</div>
<div v-if="type == 'range'" class="range">
    {{`${modelValue.getFullYear()}.${addZero((modelValue.getMonth() + 1) )}.${addZero(modelValue.getDate())}`}} - 
    {{`${destination_date.getFullYear()}.${addZero((destination_date.getMonth() + 1) )}.${addZero(destination_date.getDate())}`}}
</div>
</div>
<!--contents -->
<div class="contents common-contents-gap-20" style="margin-bottom:16px;">
    <div class="day d-f">
        <span 
        :class="[item=='일' ? 'red' : '', item=='토' ? 'primary' : '', ]"
        v-for="(item,i) in ['일','월','화','수','목','금','토']" :key="i" class="bold each">
            {{item}}
        </span>
    </div>

    <div v-for="(days,i) in computed_dates" :key="i" class="days d-f common-contents-gap-16">
        <span 
        :class="[ i == 0 && day > 10 || i == (computed_dates.length -1 ) && day < 10 ? 'gray' : '']"
        v-for="(day,ii) in days" :key="ii" class="each">
            {{day}}
        </span>
    </div>
</div>


</div>
</template>
<script>
export default {
props: ["modelValue", 'selection', 'type', 'period'],
  emits: ["update:modelValue"],
  data(){
      return{
          destination : new Date()
      }
  },
  methods:{
      getFormatDate(year, month, day) {
      month = month >= 10 ? month : "0" + month;
      day = day >= 10 ? day : "0" + day;
      return year + "-" + month + "-" + day;
    },
    addZero(i){
        return i < 10 ? '0' + i : i
        },
    nextMonth(){
        let result = new Date(this.modelValue.setMonth(this.modelValue.getMonth() + 1));
       result.setDate(1);
        this.$emit("update:modelValue", result);
    },
       prevMonth(){
        let result = new Date(this.modelValue.setMonth(this.modelValue.getMonth() - 1));
       result.setDate(1);
        this.$emit("update:modelValue", result);
    }
  },
  computed: {
      destination_date(){
         
          return new Date(new Date(this.modelValue).setDate(this.modelValue.getDate() + (this.period ? this.period : 0)))
      },
    computed_dates: function () {
      let year = this.modelValue.getFullYear();
      let month = this.modelValue.getMonth() + 1;

      const firstDay = new Date(year, month - 1, 1).getDay(); // 이번 달 시작 요일
      const lastDate = new Date(year, month, 0).getDate(); // 이번 달 마지막 날짜
      let lastYear = year;
      let lastMonth = month - 1;
      if (month === 1) {
        lastMonth = 12;
        lastYear -= 1;
      }
      const prevLastDate = new Date(lastYear, lastMonth, 0).getDate(); // 지난 달 마지막 날짜

      let monthFirstDay = firstDay;
      let monthLastDate = lastDate;
      let prevMonthLastDate = prevLastDate;

      let day = 1;
      let prevDay = prevMonthLastDate - monthFirstDay + 1;
      let local_dates = [];
      let weekOfDays = [];
      while (day <= monthLastDate) {
        if (day === 1) {
          // 1일이 어느 요일인지에 따라 테이블에 그리기 위한 지난 셀의 날짜들을 구할 필요가 있다.
          //this.month = 현재 월
          for (let j = 0; j < monthFirstDay; j += 1) {
            weekOfDays.push(prevDay);
            prevDay += 1;
          }
        }
        weekOfDays.push(day);
        if (weekOfDays.length === 7) {
          // 일주일 채우면
          local_dates.push(weekOfDays);
          weekOfDays = []; // 초기화
        }
        day += 1;
      }
      const len = weekOfDays.length;
      if (len > 0 && len < 7) {
        for (let k = 1; k <= 7 - len; k += 1) {
          weekOfDays.push(k);
        }
      }
      if (weekOfDays.length > 0) local_dates.push(weekOfDays); // 남은 날짜 추가
      this.nextMonthStart = weekOfDays[0];
      return local_dates;
    },
  },


}
</script>
<style scoped>
.common-border{
  border: solid 1px #eaeaea;
}
.common-border-8{
    border-radius: 8px;
}

.common-side-margin{
    margin: 0 20px;
}

.icon-forward{
    content:url("@/assets/img/icn_forward.svg");
}
.rotate-180{
    transform: rotate(-180deg);
}
.calendar{
    padding: 20px 0;
}

.range{
  margin: 0 0 0 6px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #2f2f2f;
}

.contents .day,
.contents .days{
    flex-basis: 0;
}



.contents .day .each,
.contents .days .each{
    flex: 1 1 0;
  font-size: 13.5px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #2f2f2f;
}

.contents .day .each.bold,
.contents .days .each.bold{
  font-weight: bold;
}
.contents .day .each.gray,
.contents .days .each.gray{
   color: #b9b9b9;
}
.contents .day .each.red,
.contents .days .each.red{
   color: #e53c0e;
}
.contents .day .each.primary,
.contents .days .each.primary{
   color: #0064FF; 
}






.title{
text-align: center;
}
.title .year{
  margin: 0 6px 0 15px;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #b9b9b9;
}
.title .month{
  margin: 0 15px 0 6px;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #2f2f2f;
}


.common-contents-gap-20{
    margin-top: 20px;
}
.common-contents-gap-16{
    margin-top: 16px;
}
</style>