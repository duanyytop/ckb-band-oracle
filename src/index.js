const WebSocket = require('ws')
const { CKB_WS_URL } = require('./utils/const')
const { postBandOracle } = require('./poster/poster')

const startPoster = async () => {
  let ws = new WebSocket(CKB_WS_URL)

  ws.on('open', function open() {
    ws.send('{"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}')
  })

  ws.on('message', async function incoming(data) {
    if (JSON.parse(data).params) {
      const tipNumber = JSON.parse(JSON.parse(data).params.result).number
      console.info('New Block', tipNumber)
      await postBandOracle()
    }
  })

  ws.on('close', async function close(code, reason) {
    console.info('Websocket Close', code, reason)
    await postBandOracle()
    startPoster()
  })
}

startPoster()
