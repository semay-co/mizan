import { PubSub } from 'apollo-server'
import SerialPort from 'serialport'
import env from 'dotenv-flow'
import { createVehicle, vehicles, vehicle } from './vehicle.resolvers'
import { createCustomer, customers, customer } from './customer.resolvers'
import {
  record,
  records,
  createRecord,
  updateRecord,
  printRecord,
  sendConfirmationSms,
  addSecondWeight,
  addCustomer,
  deleteCustomer,
} from './record.resolvers'

export enum events {
  NEW_READING = 'NEW_READING',
}

env.config()

const pubsub = new PubSub()
const comPort = process.env.SERIAL_PORT || '/dev/ttyS0'

const publish = (reading: number) => {
  pubsub.publish(events.NEW_READING, {
    reading,
  })
}

SerialPort.list().then((ports) => {
  const search = ports
    .map((port) => port.path.toLowerCase())
    .filter((path) => path === comPort.toLowerCase())

  if (process.env.EMULATE_SCALE) {
    // setInterval(() => {
    //   publish(Math.floor(Math.random() * 1000) * 10)
    // }, 30 * 1000)
  } else {
    if (search.length > 0) {
      const port = new SerialPort(comPort, {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      })

      var sign = '+'
      var publishedAt = new Date().getTime()

      port
        .on('data', (data) => {
          const snap = data.toString()

          if (snap === '0' || snap === '-') {
            sign = snap === '0' ? '+' : '-'
          } else {
            const reading = snap
              ? snap.split('=').join('').split('').reverse().join('')
              : ''.slice(0, 6)

            const fixed = +reading < 100000 ? +reading : 0

            const signed = parseInt(sign + fixed)

            if (publishedAt + 1000 < new Date().getTime() && !isNaN(signed)) {
              publish(signed)
              publishedAt = new Date().getTime()
            }
          }
        })
        .on('error', (error) => console.error)
    }
  }
})

const resolvers = {
  Query: {
    records,
    record,
    vehicles,
    vehicle,
    customers,
    customer,
  },
  Subscription: {
    reading: {
      subscribe: () => pubsub.asyncIterator([events.NEW_READING]),
    },
  },
  Mutation: {
    createRecord,
    updateRecord,
    createVehicle,
    createCustomer,
    addSecondWeight,
    addCustomer,
    deleteCustomer,
    printRecord,
    sendConfirmationSms,
  },
}

export default resolvers
