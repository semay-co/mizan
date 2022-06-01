import SerialPort from 'serialport'
import five from 'johnny-five'
import fs from 'fs'
import * as _ from 'ramda'

let redOn = false
let greenOn = false

/*
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
*/

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
            greenOn = now.getSeconds() % 2 !== 0
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
          +signed < 100000 &&
          (last !== signed || lastTime < now.getTime() - 1000) &&
          !isNaN(+signed) &&
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
    })
    .on('error', console.error)
}

export default indicator
