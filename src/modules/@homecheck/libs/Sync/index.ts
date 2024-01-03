
/*
useNetwork 는 navigator.connection을 이용하는데, 아마 ios에서는 지원안하는듯
*/
import { Axios } from '../WebRequests'
import { getRandomString, getUnixtime } from '../Functions'
import { LocalDocument } from '../LocalDocument'


const Sync = {
    local_id: '',
    unixtime: 0,
    starttime : 0
}

var localIds = {

}




/*
1) 만약, local_id를 사용하여 작업 도중, 종료하고 다시 접속하는 경우,
1-1) 그 와중에 인터넷에 연결되어 이전기록과 현재 기록 사이에 시간차이가 많이 나게 되는 경우








*/











/**
 * 상대적인 시간 가져오기
 */
export const getRelativeTime = () => {
    // 온라인인 경우, getUnixttime 하기

    //

    return `${Sync.local_id}:${Sync.unixtime}`
}


export const init = () => {
    setLocalSync();
    setSyncTimer();
}


/**
 * 로컬id 를 새로 등록
 * 
1. 현재 시간을 로컬id에 의한 상대 시간으로 지정
2. 로컬id는 Sync에서 현재 시간을 사용
 */
async function setLocalSync() {
  const UnixtTime = getUnixtime();
  const LocalId = getRandomString(8, false);
  Sync.local_id = LocalId;
    Sync.unixtime = UnixtTime;
    Sync.starttime = UnixtTime;
  await LocalDocument.set(LocalId, UnixtTime);
}

/**
 * 치환된 값 가져오기
 * `${local_id}:${unixtime} 형태로 받아와 파싱하기`
 */

async function LocalToServerTime(LocalTimeString : string) {
    const local_id = LocalTimeString.split(':')[0]
    const unixtime = parseInt(LocalTimeString.split(':')[1])
    if (!localIds[local_id]) {
       localIds[local_id] =  parseInt(await LocalDocument.get(local_id));
    }
}

/**
 * 
 * 
 * LocalSync 전용 내부 타이머
 * 
 */

function setSyncTimer() {
    setInterval(() => {
        Sync.unixtime++;
        console.log(Sync)
    }, 1000);
}



/*

1) getUnixtime 할때마다 커넥션상태인지 확인,

1-1) 만약 커넥션 상태가 아니라면, 로컬id 를 새로 등록
1-2) 현재 시간을 로컬id에 의한 상대 시간으로 지정
1-2) 로컬id는 Sync에서 현재 시간을 사용


// 이 파트를 upload할때 적용하여 항상 상대 시간만 이용하게끔?
2) 커넥션된 경우, 현재 시간과 서버 시간을 이용하여 로컬id의 시간을 서버 시간으로 치환
2-1) 저 onlineAt 같은 경우, 서버시간과 맞춰야하기 때문에, 서버에서 시간 받아오기를 해야할





 */