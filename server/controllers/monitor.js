var os = require('os')
const koa = require('koa')
const http = require('http')
const app = new koa()
const server = http.createServer(app.callback())
const options = {
  cors: {
    methods: ['GET', 'POST'],
  },
}
const io = require('socket.io')(server, options)

var osUtils = require('os-utils')
var interval = -1
var currCPU = 0
server.listen(1234)


function updateCPU() {
  setTimeout(function () {
    osUtils.cpuUsage(function (value) {
      currCPU = value
      updateCPU()
    })
  }, 0)
}

//start() // 直接运行
class MonitorController {
  static async sysMonitor(ctx) {
    io.on('connection', (socket) => {
      //连接事件
      socket.emit('connected', '连接成功')

      socket.on('disconnect', () => {
      })

      socket.on('endConnection', function (data) {
        socket.emit('unConnection', '服务器端已停止')
        clearInterval(interval)
        interval = -1
      })
    })
    updateCPU()
    if (interval < 0) {
      interval = setInterval(function () {
        var freeMem = os.freemem() / 1024 / 1024 / 1024
        var totalMem = os.totalmem() / 1024 / 1024 / 1024
        var data = {
          cpuUsage: currCPU.toFixed(3),
          freeMem: freeMem.toFixed(2) + 'G',
          totalMem: totalMem.toFixed(2) + 'G',
          usedMem: (totalMem - freeMem).toFixed(2) + 'G',
          MemUsage: ((totalMem - freeMem) / totalMem).toFixed(3),
        }
        io.sockets.emit('systemUpdate', data)
      }, 1000) //每隔1s取系统数据
      ctx.body = 200
    }
  }
}

module.exports = MonitorController
