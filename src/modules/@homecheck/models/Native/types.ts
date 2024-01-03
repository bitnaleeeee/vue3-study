export type NativeCamera = {
  start: (
    config: Partial<{
      position: string;
      ratioX: number;
      ratioH: number;
      y: number;
      x: number;
      width: number;
      height: number;
      rotateWhenOrientationChanged: boolean;
      lockAndroidOrientation: boolean;
      enableZoom: boolean;
      toBack: boolean;
      paddingBottom: number;
    }>
  ) => Promise<void>;
  capture: (config: { width: number; height: number }) => Promise<{ value: string }>;

  changeRect: (config: Partial<{ x: number; y: number }>) => Promise<void>;
  stop: () => {};
};
