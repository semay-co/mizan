import { PubSub } from 'apollo-server'
import SerialPort from 'serialport'

import { createVehicle, vehicles, vehicle } from './vehicle.resolvers'
import {
  record,
  records,
  createRecord,
  printRecord,
  addSecondWeight,
} from './record.resolvers'

const pubsub = new PubSub()
const comPort = '/dev/ttyS0'

const publish = (reading: number) => {
  pubsub.publish('NEW_READING', {
    reading,
  })
}

SerialPort.list().then((ports) => {
  const search = ports
    .map((port) => port.path.toLowerCase())
    .filter((path) => path === comPort.toLowerCase())

  console.log('env', process.env.TEST_SERIAL_PORT)

  if (search.length > 0 && !process.env.TEST_SERIAL_PORT) {
    const port = new SerialPort(comPort, {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    })

    var sign = '+'

    port
      .on('data', (data) => {
        const snap = data.toString()

        if (snap === '0' || snap === '-') {
          sign = snap === '0' ? '+' : '-'
        } else {
          const reading = snap
            ? snap.split('=').join('').split('').reverse().join('')
            : ''.slice(0, 6)

          const validReading = +reading < 100000 ? +reading : 0

          const signed = parseInt((sign + +reading))

          publish(signed)
        }
      })
      .on('error', (error) => console.error)
  } else {
    setInterval(() => {
      publish(Math.floor(Math.random() * 1000) * 10)
    }, 1000)
  }
})

export enum events {
  NEW_READING = 'NEW_READING',
}

const resolvers = {
  Query: {
    records,
    vehicles,
    record,
    vehicle,
  },
  Subscription: {
    reading: {
      subscribe: () => pubsub.asyncIterator([events.NEW_READING]),
    },
  },
  Mutation: {
    createRecord,
    createVehicle,
    addSecondWeight,
    printRecord,
  },
}

export default resolvers
