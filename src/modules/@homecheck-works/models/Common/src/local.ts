import _ from 'lodash'
import { workProject } from '../project'
import { ProjectType } from '../../enum'
import { CacheStorageDB, CacheImage } from "@/modules/@homecheck/libs/CacheStorage";

const homecheckURL = "https://homecheck.kr/cdn/?f="


export const getLocalProjects = async (account: string): Promise<never[]> => {
  const StoredProjects = await CacheStorageDB.get(`${account}-projects`);
  return (StoredProjects ? StoredProjects : [])
};

export const setLocalProjects = async (account: string, projects: never[], onProgress : (length : number, total : number)=> void): Promise<unknown> => {


  const totalList = []
  for (let project of projects){
    const parsed = workProject.Parse(project)
    const ImageList = parsed?.getLocalImages()
    totalList.push(...(ImageList ? ImageList.filter(img=> img).map(img => `${homecheckURL}${img}`) : []))
  }

  const downloaded = await CacheImage.getKeys()
  const requires = _.difference(totalList, downloaded)

  let count = 0;
  for await (let image of requires){
    await CacheImage.get(image, 5)
    onProgress(count + 1, requires.length)
  }



  return await CacheStorageDB.set(`${account}-projects`, projects);
};
