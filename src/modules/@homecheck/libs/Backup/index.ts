/*
  const backupKey = "hboamcek"
  const backupPath = `/Documents/homecheck/data/backup.json`

  async function backup() : Promise<any>{
    
    loadingView.value = {
      view : true,
      title : '데이터 백업 중',
      message : '정리중',
      progress : 0
  }
  let fileExists;
  try { fileExists = await checkFileExists({
    path: backupPath,
    directory: Directory.ExternalStorage
  }) } catch {}
  if(fileExists){
    loadingView.value.progress = -1
    loadingView.value.title = '백업 실패'
    loadingView.value.message = '이미 파일이 있습니다.'
    setTimeout(()=>{
      loadingView.value.view = false
    },2250)
    return
  }
  
    const storage = await caches.open(cachename)
    const requests = await storage.keys()
    var backupBody = {}
    
    for await(const Request of requests){
      
      const key = Request.url.split('/').pop()?.replace('.json','')
      loadingView.value.message = key
      loadingView.value.progress = loadingView.value.progress + (100 / requests.length)
      
      const Response = await storage.match(Request)
      const result = await Response.json()
      backupBody[key] = result
    }
    loadingView.value.progress = 100
    let encrypted = encrypt(JSON.stringify(backupBody),backupKey)
    Filesystem.writeFile({
      path: backupPath,
      directory: Directory.ExternalStorage,
      data: encrypted,
      recursive: true
    }).then(result => {
      loadingView.value.title = '데이터 백업 완료'
      loadingView.value.message = `${result.uri}`;
      setTimeout(()=>{
        loadingView.value.view = false
      },2250)
    }).catch(ex => {
      loadingView.value.progress = -1
      loadingView.value.title = '백업 실패'
      loadingView.value.message = ex.message;
      setTimeout(()=>{
        loadingView.value.view = false
      },2250)
    
    })
  }

  async function restore() : Promise<any> {
    let fileExists;
    try { fileExists = await checkFileExists({
      path: backupPath,
      directory: Directory.ExternalStorage
    }) } catch {}
    if(!fileExists) return;

    loadingView.value = {
      view : true,
      title : '데이터 복구 중',
      message : '정리중',
      progress : 0
  }
    Filesystem.readFile({
      path: backupPath,
      directory: Directory.ExternalStorage
    }).then(async result => {
      const decrypted = JSON.parse(decrypt(result.data,backupKey))
      
      for await (const key of Object.keys(decrypted)){
        loadingView.value.message = key
        loadingView.value.progress = loadingView.value.progress + ((Object.keys(decrypted).length / 100 ))
        
        await set(key, decrypted[key].data)
      }

      loadingView.value.title = '데이터 복구 완료'
      loadingView.value.message = '복구가 완료되었습니다.';
      setTimeout(()=>{
        loadingView.value.view = false
      },2250)
    }).catch(ex =>{
      loadingView.value.progress = -1
      loadingView.value.title = '복구 실패'
      loadingView.value.message = ex.message;
      setTimeout(()=>{
        loadingView.value.view = false
      },2250)
    })
  }

*/