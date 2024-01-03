import { App } from "@capacitor/app";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { Toast } from "@capacitor/toast";
import type { CodepushConfig } from "..";
import { Lib } from "..";
import { getHomecheckPlugin } from "../Capacitor/homecheck";

export namespace CodePush {
  var latestVersionURL = "";
  // engine으로 움직여야함
  var updateChecking = false;
  var whenUpadting = () => {};
  export const Init = (config: CodepushConfig) => {
    console.log("codePushInit");
    // 설정을 넘겨 받음
    latestVersionURL = config.latestVersionURL;
    whenUpadting = config.updating;

    CapacitorUpdater.notifyAppReady();

    // 처음 실행 확인
    getHomecheckPlugin().then((result) => {
      if (result) {
        checkUpdate(0);
      }
    });

    App.addListener("appStateChange", async (state) => {
      if (state.isActive) {
        checkUpdate(0);
      }
    });
  };

  async function checkUpdate(retry: number) {
    console.log("[codepush] checkUpdates..", retry);
    if (updateChecking || retry > 10) return;
    const Retry = retry + 1;
    updateChecking = true;
    try {
      let res = await fetch(latestVersionURL);
      const received = await res.json();
      if (Lib.appVersion != received.v) {
        whenUpadting();
        // router.push('/update')
        // 만약 하드코딩된 버전과 버전관리의 버전이 다른 경우
        Toast.show({ text: "업데이트를 다운로드 중입니다." });

        CapacitorUpdater.download({ url: received.u, version: received.v })
          .then(async (update) => {
            Toast.show({ text: "업데이트를 적용하는 중입니다." });

            CapacitorUpdater.set(update)
              .then(() => {
                Toast.show({ text: "업데이트가 완료되었습니다." });
              })
              .catch((ex) => {
                throw new Error(ex.message);
              });
          })
          .catch((ex) => {
            throw new Error(ex.message);
          });
      }
    } catch (ex: any) {
      // Toast.show({ text: ex.message });
      setTimeout(() => checkUpdate(Retry), 45 * 1000);
    } finally {
      setTimeout(() => (updateChecking = false), 30 * 1000);
    }
  }
}
