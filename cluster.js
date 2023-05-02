const pm2 = require('pm2')
const numCPUs = require('os').cpus().length
const cluster = require('cluster')

const instances = numCPUs || -1
const maxMemory = process.env.WEB_MEMORY || 512

// pm2.connect(() => {
//   pm2.start(
//     {
//       script: 'index.js',
//       instances: instances,
//       max_memory_restart: `${maxMemory}M`,
//       env: {
//         NODE_ENV: process.env.NODE_ENV || 'development',
//         NODE_PATH: '.',
//       },
//     },
//     (err) => {
//       if (err) {
//         return console.error('Error while launching applications', err.stack || err)
//       }

//       console.log('PM2 and application has been succesfully started')

//       pm2.launchBus((_, bus) => {
//         console.log('[PM2] Log streaming started')

//         bus.on('log:out', (packet) => {
//           console.log('[App:%s] %s', packet.process.name, packet.data)
//         })

//         bus.on('log:err', (packet) => {
//           console.error('[App:%s][Err] %s', packet.process.name, packet.data)
//         })
//       })
//     },
//   )
// })

const cluster = require('cluster')
const http = require('http')

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end('hello world\n')
    })
    .listen(8000)

  console.log(`Worker ${process.pid} started`)
}
