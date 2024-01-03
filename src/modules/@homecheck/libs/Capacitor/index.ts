import { registerPlugin, Capacitor } from '@capacitor/core'
import { Device } from "@capacitor/device"
import { formatBytes } from '../Functions'

export * from './homecheck'


export const getInfo = async () => {
    return { ...await Device.getInfo(), ... await Device.getId() }
}

export const getId = async () => {
    return (await Device.getId()).identifier
}

export const getPlatform = () => Capacitor.getPlatform()


export const isWeb =  getPlatform() == 'web'

export const getFreeSpace = async () => {
    return formatBytes((await getInfo()).realDiskFree!)
}

