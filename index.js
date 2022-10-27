const express = require('express')
const { WebsocketClient, Tendermint34Client, HttpClient } = require('@cosmjs/tendermint-rpc')
const { checkMissBlock } = require('./util')

const app = express()
const port = 3000

let node = 'http://95.217.121.243:2071/'

// let client = RpcClient(node)

const setupSocket1 = async () => {
    const socketClient = new WebsocketClient(node)
    return socketClient
}


const setupSocket = async () => {
    const httpClient = new HttpClient(node)
    const socketClient = await Tendermint34Client.create(httpClient)
    return socketClient
}

let uptimes = []

app.get('/socket', async (req, res) => {
    try {
        // const socket = await setupSocket()
        let socket1 = await setupSocket1()
        let stream = socket1.listen({
            "jsonrpc":"2.0", 
            "id": -1, 
            "method": "subscribe", 
            "params": {
                "query": "tm.event='NewBlock'"
            }
        })
        // socket.subscribeNewBlock()
        stream.map(data => data)
        stream.addListener({
            next: (data) => {
                console.log(data.data.value.block.last_commit.signatures)
            }
        })
        res.json({
            data: uptimes
        })
    }
    catch (e) {
        res.send(e.message)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})