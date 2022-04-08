const express = require('express')
const morgan = require('morgan')
const {Worker} = require('worker_threads')


const app = express()
app.use(morgan('dev'))


app.get('/nonBlocking',(req,res)=>{
    return res.status(200).send("Non Blocking Result")
})

app.get('/blocking',async(req,res)=>{
    try {
        //create a promise object and wait for worker thread to resolve it
        const sum = await new Promise((resolve,reject)=>{
            //create a worker thread assign a file (can't pass function)
            //worker always executes an entire file/script
            //to pass data use {workerData}
            const worker = new Worker('./cpuIntensive.js', {workerData:{n:100000000000}})

            //using .on similar to using sockets
            //if the script's parentPort uses postMessage, return success
            worker.on('message',resolve)

            //if error occurs in worker script
            worker.on('error', reject)

            //if the worker exits, and the code is not 0 i.e. exited before script completed
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            })
        })

        return res.status(200).send(sum.toString())
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})


app.get('/',(req,res)=>{
    return res.status(404).send("Error 404! Not Found")
})

app.listen(8080,()=>{
    console.log("App listening on port 8080")
})