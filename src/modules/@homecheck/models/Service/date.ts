import _ from 'lodash'


//1) 확장성 높은 constructor

// * unixtime에서 해당 클래스로 변환
// * 10:00~12:00 , 10:00 에서 시간형 데이터로 변환
// * string 기반 최대한 데이터 변환



//2) 10:00~12:00 처럼 시작 시간, 끝나는 시간 계산

// 


//3) 서비스 날짜를 표현하기 위함이므로,

// * 단순 날짜 : 1일을 표현 가능
// * 요청 및 확정 날짜 : 각각 연관성 없는 날짜 2개를 표현, 요청 및 확정은 다수가 될 수 있음
// * 기간 날짜 : 기간을 표현 
// * 기간 요쳥 및 기간 확정 날짜 : 각각 연관성 없는 기간 2개를 표현, 기간 요청 및 기간 확정은 다수가 될 수 있음
// * 각각에 시간도 포함하는지
// * 시간을 포함한다면, 시간도 기간

// * 기간의 주의점 : 전자는 과거, 후자는 미래가 고정되어야하며, 둘의 위치가 바뀔 수 없음



// +

// 옵션으로 시간을 포함시킬 수 있음
// 10:00~12:00 , 10:00 처럼 단일 시간 또는 기간 시간

// +

// 각 날짜간 비교가 가능하도록 계산


// + 아이디어
// 모든 데이터를 unixtimestamp로 변환하여 계산
// class ? type? 을 지정하여 time도 포함 하는지 구분.
// 오직 시간만을 지정할 수도 있음 => 굳이?



//4) 기간인 경우, 함수를 통해 특정날짜가 해당 날짜데이터와 겹치는지 확인가능해야함




export class Time {
    static SampleData = [
        "10:00~12:00",
        "12:00~14:00",
        "14:00~16:00",
        "10:00~11:45",
        "11:45~13:30",
        "13:30~15:15",
        "15:15~17:00",
        "10:00~11:30",
        "11:30~13:00",
        "13:00~14:30",
        "14:30~16:00"
      ];
  constructor(timestring) {
    let trimmed = timestring.replaceAll(" ", "");
    this.start = trimmed.split("~")[0];
    this.end = trimmed.split("~")[1];
    this.raw_string = trimmed;
    this.isPeriod = timestring.includes("~");
  }
  static toTimeArray(array){
    return array.map((time) => {
        return new Time(time);
      });
  }
  toMinuteArray() {
    let splited = this.start.split(":");
    let startTime = splited[0] * 60 + splited[1] * 1;
    splited = this.end.split(":");
    let endTime = splited[0] * 60 + splited[1] * 1;
    return Array.from(
      { length: endTime - startTime },
      (_, i) => i + 1 + startTime
    );
  }

  static SplitByMinutes(Time,minutes){
    let start = Time.split("~")[0]
    let end = Time.split("~")[1]
    let startIndex = (start.split(":")[0] * 60) + (start.split(":")[1] * 1);
    let endIndex = (end.split(":")[0] * 60) + (end.split(":")[1] * 1);
    let result = [];
    for (let i=startIndex; i < endIndex; i++)
    {
      if(i%minutes ==0)
      {
        result.push(i)
      }
    }
    
    result= result.map(timeInt=>{
      let hour = Math.floor(timeInt / 60);
      let minute = timeInt % 60;
      
      return `${hour.toString().length == 1 ? `0${hour}` : hour}:${minute.toString().length == 1 ? `0${minute}` : minute}`
    })
    result.push(end)
    return result
  }

  static ScheduleCalculator(scheduleArr) {
    return this.combineSchedulesResult(this.combineSchedule({ array: this.toTimeArray(scheduleArr) }), []);
  }  
  
  static combineSchedulesResult(combined, result) {
    result.push(combined.insert)
     return (combined.array.length > 0) ? this.combineSchedulesResult( this.combineSchedule(combined), result) : result;
  }
  
  static combineSchedule(arr, attach,integral = []) {
    let time = _.cloneDeep(attach ? attach :  arr.array[0]);
    let original = _.cloneDeep(attach ? attach : arr.array[0]);
  
    const findStart = _.find(arr.array, { end: time.start });
    const findStartIndex = _.findIndex(arr.array, { end: time.start });
    if (findStartIndex != -1) {
      integral.push(findStart.raw_string)
      time = new Time(`${findStart.start}~${time.end}`);
      arr.array.splice(findStartIndex, 1);
    }
  
    const findEnd = _.find(arr.array, { start: time.end });
    const findEndIndex = _.findIndex(arr.array, { start: time.end });
    if (findEnd) {
      integral.push(findEnd.raw_string)
      arr.array.splice(findEndIndex, 1);
      time = new Time(`${time.start}~${findEnd.end}`);
    }

    let find = _.find(arr.array, { raw_string: original.raw_string });
    let findIndex = _.findIndex(arr.array, { raw_string: original.raw_string });
    if (find) {
        integral.push(find.raw_string)
        arr.array.splice(findIndex, 1);
      }
  
  
    if (original.raw_string == time.raw_string) {
        integral = integral.sort()
      return { array: arr.array, insert: { [`${time.raw_string}`] : integral }};
    } else {
      return this.combineSchedule(arr, time, integral);
    }
  }
  













}
