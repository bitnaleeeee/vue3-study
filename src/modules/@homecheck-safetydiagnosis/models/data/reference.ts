import { basic } from "@/modules/@homecheck/models/common";
import {DataTypes} from "./enum"

export class data extends basic {
  memo: string = "";
  type: DataTypes = DataTypes.NONE;
}
