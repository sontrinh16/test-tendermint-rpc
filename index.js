const express = require('express')
const { WebsocketClient, Tendermint34Client, HttpClient } = require('@cosmjs/tendermint-rpc')
const { checkMissBlock } = require('./util')

const app = express()
const port = 3000

let node = 'http://95.217.121.243:2071/'

// let client = RpcClient(node)

const setupSocket = () => {
    const socketClient = new WebsocketClient(node)
    return socketClient
}

let uptimes = []

startSocket = () => {
    try {
        let socket = setupSocket()
        let stream = socket.listen({
            "jsonrpc":"2.0", 
            "id": -1, 
            "method": "subscribe", 
            "params": {
                "query": "tm.event='NewBlock'"
            }
        })
        stream.map(data => data)
        stream.addListener({
            next: (data) => {
                let signInfo = data.data.value.block.last_commit.signatures
                let valAddrs = signInfo.map(sig => sig.validator_address)
                const check = checkMissBlock('junovalcons', valAddrs, 'junovalcons17rqsk5awpuynqask573sl25dgafm628rwvp7qq')
                if (!check) {
                    const height = data.data.value.block.header.height
                    uptimes.push({
                        status: 'success',
                        height: height
                    })
                }
                console.log(check)
            }
        })
    }
    catch (e) {
        alert(e.message)
    }
}

startSocket()

// app.get('/socket', (_, res) => {
//     try {
//         let socket = setupSocket()
//         let stream = socket.listen({
//             "jsonrpc":"2.0", 
//             "id": -1, 
//             "method": "subscribe", 
//             "params": {
//                 "query": "tm.event='NewBlock'"
//             }
//         })
//         stream.map(data => data)
//         stream.addListener({
//             next: (data) => {
//                 let signInfo = data.data.value.block.last_commit.signatures
//                 let valAddrs = signInfo.map(sig => sig.validator_address)
//                 const check = checkMissBlock('junovalcons', valAddrs, 'junovalcons17rqsk5awpuynqask573sl25dgafm628rwvp7qq')
//                 if (check) {
//                     uptimes.push({
//                         status: 'success',
//                         height: 2
//                     })
//                 }
//                 console.log(check)
//             }
//         })
//         res.json({
//             data: uptimes
//         })
//     }
//     catch (e) {
//         res.send(e.message)
//     }
// })

app.get('/uptime', (req, res) => {
    res.json({
        data: uptimes
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})