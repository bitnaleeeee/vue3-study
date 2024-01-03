import { registerPlugin } from "@capacitor/core";


/**
 * @deprecated The method should not be used
 */
function a (){

}

type FlirPlugin = {
  getLastImage : ()=>Promise<FlirImageResult | Boolean>
  getStatus : ()=> Promise<FlirStatusResult | Boolean>
}

type NativeFlirPlugins = {
  getLastImage : (args : LastImageArguments)=>Promise<FlirImageResult>
  getStatus : () => Promise<FlirStatusResult>
}


type LastImageArguments = {
  timeout : number
}

type FlirImageResult = {
  status : string
  thermalImage : string
  visualImage : string
}

type FlirStatusResult = {
  status : string
  battery : string
  connected : boolean
  connectedDevice : string
}
//` status : 'ok' , battery : '0%', connected : true, connectedDevice : 'FLIR E5 Wifi - 639039629@192.168.139.11'`

var FLIR : NativeFlirPlugins
export const getFlirPlugin = async() : Promise<FlirPlugin> => {
  FLIR = registerPlugin("Flir") as NativeFlirPlugins;
  
  return {
    getLastImage,
    getStatus
  }
}

async function getLastImage() : Promise<FlirImageResult | Boolean> {
  const result = await FLIR.getLastImage({
    timeout: 4500,
  });
  return (result.status == "ok") ? result : false
}

async function getStatus() : Promise<FlirStatusResult | Boolean> {
  const result = await FLIR.getStatus();  
  return (result.status == "ok") ? result : false
}
/*
            useNotifications().addNotifications({
                title: 'FLIR 연결', content: getStatusResult.message, duration: useSettings().get('notiDuration'), status: getStatusResult.status
            })
            */
  /*
        let CaptureNotification = useNotifications().addNotifications({
            title: 'FLIR 저장', content: 'FLIR을 다운로드하는 중 입니다.',
            pending: {
                result: () => { },
                config: {
                    title: 'FLIR 저장',
                    content: ``,
                    pending: null,
                    duration: 300,
                    status: 'ok'
                }
            }
        })
        */
           /*
            if (useSettings().get('flirDuration') > 0) {
                useNotifications().changeNotifications(CaptureNotification, {
                    pending: {
                        result: () => { },
                        config: {
                            status: 'none',
                            title: 'FLIR 다운로드 완료',
                            content: `<div class="square-img-wrapper" ><img width="100%" src="data:image/jpg;base64,${flir_data['thermalImage']}"/></div>`,
                            pending: null,
                            duration: 100 * useSettings().get('flirDuration'),
                            click: () => useNotifications().deleteNotifications({
                                id: CaptureNotification
                            })
                        }
                    }
                })
            }
            else {
                useNotifications().deleteNotifications({
                    id: CaptureNotification
                });
                
            }
            useNotifications().resolveNotifications(CaptureNotification)
            */
    /*
            useNotifications().changeNotifications(CaptureNotification, {
                pending: {
                    result: () => { },
                    config: {
                        status: flir_data.status,
                        content: `${flir_data.message}`,
                        title: 'FLIR 실패',
                        pending: null,
                        duration: 100 * useSettings().get('notiDuration'),
                    }
                }
            })
            useNotifications().resolveNotifications(CaptureNotification)
            */






// onError
// => {status : "failed", message : 'errorMessage'}

// void getLastImage ( with empty props)
// => { status : ok, thermalImage : 'base64', visualImage: 'base64' }

// void Calibrate( no props)
// =>  ( status : "ok", message : Calibrating )

// void getStatus (no props)
// => { status : 'ok' , battery : '0%', connected : true, connectedDevice : 'FLIR E5 Wifi - 639039629@192.168.139.11'}

//void HealthCheck(no props)
// => {status : 'failed', 'healthCheck is already process in}

