import { srcToWebP, blobToWebP, arrayBufferToWebP } from "webp-converter-browser";

export const dataURLtoFile = (base64: string, fileName: string) => {
  let arr: string[] = base64.split(",") as string[];
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const base64ToFile = async (base64: string, filename: string, mime?: string): Promise<File> => {
  return new Promise((resolve) => {
    fetch(mime ? `data:${mime};base64,${base64}` : `${base64}`)
      .then((res) => {
        res
          .blob()
          .then(async (blob) => {
            resolve(new File([blob], filename, { type: mime }));
          })
          .catch((_ex) => {
            reject(_ex);
          });
      })
      .catch((ex) => {
        reject(ex);
      });
  });
};

export const blobToFile = (blob: Blob, filename: string) => {
  return new File([blob], filename, { type: blob.type });
};

export const getImageSize = async (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = url;
  });
};

export const rotateImage = async (file: File, degree: number) : Promise<File> => {
  
  return new Promise((resolve) => {
     const img: HTMLImageElement = new Image();
     const blobURL = URL.createObjectURL(file);
     img.src = blobURL;

     const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
     const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

     //draw the image
     img.onload = function () {
       canvas.width = degree == 90 || degree == 270 ? img.height : img.width;
       canvas.height = degree == 90 || degree == 270 ? img.width : img.height;
       context.translate(0 + canvas.width / 2, 0 + canvas.height / 2);
       context.rotate((degree * Math.PI) / 180);
       context.drawImage(img, (img.width / 2) * -1, (img.height / 2) * -1, img.width, img.height);
       context.save();
       //console.log(canvas.toDataURL('image/webp',0.8))
       resolve(dataURLtoFile(canvas.toDataURL("image/webp", 0.8), file.name));
       URL.revokeObjectURL(blobURL);
       canvas.remove();
     };
  })
}

