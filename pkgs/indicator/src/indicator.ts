import SerialPort from 'serialport'
import five from 'johnny-five'
import fs from 'fs'
import os from 'os'
import path from 'path'
import * as _ from 'ramda'
import PouchDB from 'pouchdb'

const ensureExists = (path: string, mask: number = 777) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, mask, (err) => {
      if (err) {
        if (err.code === 'EEXIST') resolve(null)
        else reject(err)
      } else resolve(null)
    })
  })
}

const mizanDir = path.join(os.homedir(), '.mizan')
const dbDir = path.join(mizanDir, 'db')
const remoteUrl = 'http://mizanadmin:$implepass2022@159.223.1.144:5984'

const init = async () => {
  await ensureExists(mizanDir)
  await ensureExists(dbDir)
}

init()

const DB = new PouchDB(`${dbDir}/indicators`)


const syncOptions = {
  batch_size: 5,
  batches_limit: 2,
  live: false,
  retry: true,
  back_off_function(delay: number) {
    if (delay === 27000 || delay === 0) {
      return 1000;
    }
    return delay * 3;
  },
}

// DB.sync(`${remoteUrl}/indicators`, syncOptions)

let redOn = false
let greenOn = false

fs.exists('/dev/ttyUSB1', (exists) => {
  if (!exists) return 

  try {
    const board = new five.Board({
      port: '/dev/ttyUSB1',
    })

    board.on('ready', () => {
      board.pinMode(RED, 1)
      board.pinMode(GREEN, 1)

      board.loop(200, () => {
        const redVal = redOn ? 1 : 0

        board.digitalWrite(RED, redVal)

        const greenVal = greenOn && !redOn ? 1 : 0

        board.digitalWrite(GREEN, greenVal)
      })
    })
  } catch (err) {
    console.log(err)
  }
})

const GREEN = 7
const RED = 8

let trail: any[] = []

const indicator = (
  onResult: (reading: any, display: any, stable: any) => any
) => {
  const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600,
  })

  port.on('open', () => {
    // console.log('open')
    // port.on('data', console.log)
  })

  port.on('error', console.error)

  let last = Math.PI
  let lastTime = new Date().getTime()
  let lastSaveTime = new Date().getTime()
  let lastSaveVal: number | undefined = undefined

  port
    .on('data', (data: any) => {
      const snap = data.toString()
      const now = new Date()

      let sign = '+'

      if (snap === '0' || snap === '-') {
        sign = snap === '0' ? '+' : '-'
        // console.log(snap)
      } else {
        const reading = snap
          ? snap.split('=').join('').split('').reverse().join('')
          : ''.slice(0, 6)

        const parsed = parseInt(`${sign}${reading}`, 10)

        const signed = isNaN(parsed) ? -1 : parsed

        if (isNaN(parsed)) {
        
          //console.log('reading:', reading)
        }

        if (+signed === 0) {
          redOn = false
          greenOn = true
        } else {
          greenOn = false

          if (+signed < 0) {
            const mil = now.getMilliseconds()
            // console.log(+signed)

            redOn = mil < 200 || (mil >= 400 && mil < 600) || mil >= 800
          } else if (+signed <= 500) {
            const mil = now.getMilliseconds()

            redOn = mil < 250 || (mil >= 500 && mil < 750)
          } else {
            redOn = now.getSeconds() % 2 === 0
          }
        }

        const change = Math.abs(+last - +signed)
        const l = trail.length

        const tl = 200

        if (l >= tl) {
          trail.shift()
        }

        if (change >= 15) {
          trail = []
        }

        trail.push(signed)

        const stable = l
          ? Math.round(trail.reduce((a, c) => a + c, 0) / l / 5) * 5
          : signed

        // console.log('stable:', stable)

        if (
          !isNaN(+signed) &&
          +signed < 100000 
        ) {

          if (
            +change > 0 &&
            (
              +change >= 20 ||
              +signed === 0 || 
              lastSaveTime < now.getTime() - 500
            )  &&
            lastSaveVal !== signed
          ) {
            const saveTime = now

            DB.put({
              _id: saveTime.getTime().toString(),
              value: signed,
            })

            lastSaveTime = saveTime.getTime()
            lastSaveVal = signed
          }

          if (
            (last !== signed || lastTime < now.getTime() - 1000) &&
            lastTime < now.getTime() - 250
          ) {
            const stable = signed

            const outdated = change === 0 && lastTime >= now.getTime() - 1000


            const smallChange =
              signed > 200 &&
              change !== 0 &&
              change < 15 &&
              lastTime >= now.getTime() - 3000

            if (outdated || !smallChange) {
              onResult(signed, signed, stable)

              last = signed
              lastTime = now.getTime()
            }
          }
        }
      }
    })
    .on('error', console.error)
}

export default indicator
