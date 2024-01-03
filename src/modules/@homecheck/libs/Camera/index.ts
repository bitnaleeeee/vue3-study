import { ref } from "vue";
import { registerPlugin } from "@capacitor/core";

import type { NativeCamera } from "@/modules/@homecheck/models";

class CameraController {
  isActive: boolean = false;

  NativeCamera: NativeCamera = registerPlugin("NativeCamera");

  position: "rear" = "rear";

  ratioX: number = 0;
  ratioY: number = 0;

  screenY: number = -1;
  screenX: number = -1;

  screenHeight: number = 0;
  screenWidth: number = 0;

  rotateWhenOrientationChanged: boolean = false;
  lockAndroidOrientation: boolean = true;
  enableZoom: boolean = true;
  toBack: boolean = false;
  paddingBottom: number = 0;

  constructor() {
    console.log("[@homecheck] camera enabled");
  }
  async previewStart(element: HTMLDivElement) {
    return new Promise((resolve, reject) => {
      const Rect = element.getBoundingClientRect();
      this.setScreen(0, Math.ceil(Rect.top), Math.ceil(Rect.width), Math.ceil((Rect.width / 4) * 3));

      this.NativeCamera.start({
        position: this.position,
        ratioX: this.ratioX,
        ratioH: this.ratioY,
        y: this.screenY,
        width: this.screenWidth,
        height: this.screenHeight,
        rotateWhenOrientationChanged: this.rotateWhenOrientationChanged,
        lockAndroidOrientation: this.lockAndroidOrientation,
        enableZoom: this.enableZoom,
        toBack: this.toBack,
        paddingBottom: this.paddingBottom,
      }).then(() => {
        setTimeout(async () => {
          const Rect2 = element.getBoundingClientRect();
          this.setScreen(Math.ceil(Rect2.x), Math.ceil(Rect2.top), Math.ceil(Rect.width), Math.ceil((Rect.width / 4) * 3));

          this.changeRect(this.screenX, this.screenY);
          this.setScreenClipPath();
          this.isActive = true;
          resolve(null);
          console.log(await this.GetResolutionList());
        }, 50);
      });
    });
  }

  async previewStop() {
    return new Promise((resolve) => {
      this.NativeCamera.changeRect({ x: 9999 }).then(() => {
        setTimeout(() => {
          this.NativeCamera.stop();
          this.isActive = false;
          resolve(null);
        }, 10);
      });
    });
  }

  async changeRect(x: number, y: number = -1) {
    return await this.NativeCamera.changeRect({
      x: Math.ceil(x),
      y: Math.ceil(y),
    });
  }

  setScreen(x: number, y: number, width: number, height: number) {
    this.screenX = x;
    this.screenY = y;
    this.screenWidth = width;
    this.screenHeight = height;
  }
  setRatio(x: number, y: number) {
    this.ratioX = x;
    this.ratioY = y;
  }

  setScreenClipPath() {
    console.log("screen : ", this.screenX, "," , this.screenY)
    console.log("screenWH : ", this.screenWidth, ",", this.screenHeight);
    const deviceWidth = window.innerWidth;
    const deviceHeight = window.innerHeight;

    var clip_top = (this.screenY / deviceHeight) * 100;
    var clip_bottom = ((this.screenY + this.screenHeight) / deviceHeight) * 100;
    var clip_left = (this.screenX / deviceWidth) * 100;
    var clip_right = ((this.screenX + this.screenWidth) / deviceWidth) * 100;

    const output = `polygon(0 0, 0 100%, ${clip_left}% 100%, ${clip_left}% ${clip_top}%, ${clip_right}% ${clip_top}%, ${clip_right}% ${clip_bottom}%, ${clip_left}% ${clip_bottom}%, ${clip_left}% 100%, 100% 100%, 100% 0 )`;
    document.querySelector(":root")!.style.setProperty("--camera-controller-screen-crop", output);
    return output;
  }
  getAppClipPath() {
    // 1 전체 사이즈 가져오기
    // 2 스크린 사이즈 가져오기
    //
  }

  async capture() {
    console.log("capture");
    let capture_data = await this.NativeCamera.capture({
      width: 2048,
      height: 1536,
    });
    console.log('return');
    // only Android
    return {
      extension: "webp",
      base64: capture_data.value,
    };
  }

  GetResolutionList() {
    return new Promise(async (resolve, reject) => {
      console.log("getResolutionList");
      let list = await this.NativeCamera.getResoltionList();
      console.log(list);
      resolve(list);
    });
  }
}

export const cameraController = ref<CameraController>(new CameraController());
