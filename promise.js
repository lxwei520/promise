
const promise = fn => {
  let that = this;
  this.state = "pending"
  this.fnCallbacks = [];
  this.value;
  this.reason;
  this.rejectCallbacks =[];

  let resolve = data =>{
    setTimeout(()=>{
      that.state = "fulfilled";
      that.value = data;
      that.fnCallbacks.map(func=>func(data))
    }, 0)
  }

  let reject = data =>{
    setTimeout(()=>{
      that.state = "rejected";
      that.reason = data;
      that.rejectCallbacks.map(func=>func(data))
    }, 0)
  }

  fn(resolve, reject)
}

promise.prototype.then = (resolve, reject)=>{
  let that = this;
  let promise2;
  let onResolve = typeof resolve == "function" ? resolve : r=>r;
  let onReject = typeof reject == "function" ? reject : r=>r;

  if(this.state == "pending"){
    return promise2 = new promise((resolve, reject)=>{
      that.fnCallbacks.push(value=>{
        try{
          let r = onResolve(value)

          promiseResolve((promise2, r, resolve, reject);
        }catch (e) {
          reject(e)
        }
      })

      that.rejectCallbacks.push(value=>{
        try{
          let r = onReject(value)

          promiseResolve((promise2, r, resolve, reject);
        }catch (e) {
          reject(e)
        }
      })
    })
  }

}

let promiseResolve = (promise2, r, resolve, reject)=>{
  let thenCancelled = false;

  if( promise2 === r){
    return reject(new TypeError("promise2 === r is not allowed"))
  }

  if(r instanceof promise){
    r.then(resolve, reject)
  }

  if (typeof r === "object" || typeof r === "function"){
    try {
      let then = r.then

      if(typeof then == "function"){
        then.call(r, function onFulfilled(y) {
          if(thenCancelled) return;
          thenCancelled = true;

          return promiseResolve(promise2, y, resolve, reject)
        }, function onRejected(y) {
          if(thenCancelled) return;
          thenCancelled = true;

          return reject(y)
        })
      }
    }catch (e) {
      if(thenCancelled) return;
      thenCancelled = true;
      reject(e)
    }
  } else {
    resolve(r)
  }
}