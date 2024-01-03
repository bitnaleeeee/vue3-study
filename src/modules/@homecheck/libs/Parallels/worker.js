console.log('worker.js')


self.onmessage = function (e) {
    console.log('onMessage : ',  e.data)
  self.postMessage(e.data)
};