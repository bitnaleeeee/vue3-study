import { getRandomString, getUnixtime, includeCDN } from "@/modules/@homecheck/libs/min";
import { basic } from '@/modules/@homecheck/models/common'

export type img = {
  url: string;
  __deleted__: number;
  force?: Boolean;
};

export class _basic extends basic {
  _id: string = getRandomString(10, false);

  /*
floorplan_id: string = ""; // 평면도의 아이디
  schedule_id: string = ""; // 기록의 id
  render?: Render;
    path?: PathShape;
    
  
    */
  __skip__: boolean = false;
  __deleted__: number = 0;
  imgs: img[] = []; // includeCDN 으로 판단

 
  getNotuploadedImgs(): img[] {
    return this.imgs.filter((_item) => !includeCDN(_item.url));
  }
  getImgs(): img[] {
    return this.imgs.filter((_item) => _item.__deleted__ < 1)
  }

  pushImg(img: img) {
    this.imgs.unshift(img)
    this.__modified__ = getUnixtime()
  }

  getForceImg(): img {
    const findIndex = this.getImgs().findIndex((_item) => _item.force)
    if (findIndex == -1) {
     return this.getImgs()[0];
    }
    else 
    {
     return this.getImgs()[findIndex] 
    }
  }
}



export class _static extends basic {
  _id: string = getRandomString(10, false);
  floorplan_id: string = "";
  floorplans_id: string = ""; // 평면도 그룹의 아이디
  schedule_id: string = ""; // 기록의 id

  __skip__: boolean = false;
  __deleted__: number = 0;
  __modified__: number = getUnixtime();
  imgs: img[] = []; // includeCDN 으로 판단
  getImgs(): img[] {
    return this.imgs.filter((_item) => _item.__deleted__ < 1);
  }

  pushImg(img: img) {
    this.imgs.unshift(img);
    this.__modified__ = getUnixtime();
  }
  getForceImg(): img {
    const findIndex = this.imgs.findIndex((_item) => _item.force);
    if (findIndex == -1) {
      return this.imgs[0];
    } else {
      return this.imgs[findIndex];
    }
  }
}