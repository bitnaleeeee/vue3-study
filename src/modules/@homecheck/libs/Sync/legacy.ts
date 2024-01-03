/*
useNetwork 는 navigator.connection을 이용하는데, 아마 ios에서는 지원안하는듯
*/
import {Axios} from "../WebRequests";
import {getRandomString, getUnixtime} from "../Functions";
import {LocalDocument} from "../LocalDocument";

type SyncStatus = {
  mode: SyncMode;
  local_id: string;
  unixtime: number;
};

enum SyncMode {
  OFFLINE,
  ONLINE,
  UNDEFINED,
  NOT_LOADED,
}

const Sync: SyncStatus = {
  mode: SyncMode.NOT_LOADED,
  local_id: "",
  unixtime: 0,
};

export const getServerTime = () => {
  // 온라인인 경우, getUnixttime 하기
  //
};

export const refreshSyncStatus = async () => {
  return new Promise(async (resolve) => {
    await refreshSyncMode();

    resolve(null);
  });
};

/** 
 *  싱크 모드 확인 요청시, 인터넷 연결 확인
 * 
1. 인터넷이 연결되어 있는 경우, 서버 시간을 받아와서, 현재 시간으로 설정
2. 오프라인인 경우, 로컬 시간을 시작으로 오프라인 모드 작동
*/
async function refreshSyncMode() {
  try {
    const res = await Axios.get("https://homecheck.kr/api/v2/gettime");
    Sync.mode = SyncMode.ONLINE;
    Sync.unixtime = res.data.data;
  } catch (ex) {
    // 만약 새로고침했을때, 온라인이 아니었던 경우에만 로컬 싱크모드로 전환
    if (Sync.mode == SyncMode.ONLINE || Sync.mode == SyncMode.NOT_LOADED) {
      await setToLocalSyncMode();
    }
    switch (ex.message) {
      case "Network Error":
        Sync.mode = SyncMode.OFFLINE;
        break;
      default:
        Sync.mode = SyncMode.UNDEFINED;
        break;
    }
  }
  console.log(Sync);
}

/**
 * 로컬id 를 새로 등록
 * 
1. 현재 시간을 로컬id에 의한 상대 시간으로 지정
2. 로컬id는 Sync에서 현재 시간을 사용
 */
async function setToLocalSyncMode() {
  const UnixtTime = getUnixtime();
  const LocalId = getRandomString(8, false);
  Sync.local_id = LocalId;
  Sync.unixtime = UnixtTime;

  await LocalDocument.set(LocalId, UnixtTime);
}

/**
 * 치환된 값 가져오기
 * `${local_id}:${unixtime} 형태로 받아와 파싱하기`
 */

async function LocalToServerTime(LocalTimeString: string) {}

/*

1) getUnixtime 할때마다 커넥션상태인지 확인,

1-1) 만약 커넥션 상태가 아니라면, 로컬id 를 새로 등록
1-2) 현재 시간을 로컬id에 의한 상대 시간으로 지정
1-2) 로컬id는 Sync에서 현재 시간을 사용


// 이 파트를 upload할때 적용하여 항상 상대 시간만 이용하게끔?
2) 커넥션된 경우, 현재 시간과 서버 시간을 이용하여 로컬id의 시간을 서버 시간으로 치환
2-1) 저 onlineAt 같은 경우, 서버시간과 맞춰야하기 때문에, 서버에서 시간 받아오기를 해야할





 */
