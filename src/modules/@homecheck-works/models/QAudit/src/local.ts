import { HyundaiQAuditRecordData } from "../record";

import { CacheStorageDB } from "@/modules/@homecheck/libs/CacheStorage";

export const getLocalData = async (data_id: string): Promise<HyundaiQAuditRecordData[]> => {
    const StoredData= await CacheStorageDB.get(data_id);
    if(!StoredData){
      return StoredData
    }
  return StoredData.map((data)=> HyundaiQAuditRecordData.Parse(data) )
};


export const saveLocalData = async (data_id: string, value : any) : Promise<void> => {
  await CacheStorageDB.set(data_id, value)
}


