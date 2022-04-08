const {workerData, parentPort} = require('worker_threads')

let sum = 0
for(let i=0;i<workerData.n;i++){
    sum+=i
}

//when the task is completed return using parentPort
parentPort.postMessage(sum)
console.log('this is printed')

//exit thread
process.exit(0)

// throws error catched by worker.on('error',reject) because abcd is not defined
// parentPort.postMessage(abcd)