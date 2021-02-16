import { PubSub } from 'apollo-server'
import PouchDB from 'pouchdb'
import SerialPort from 'serialport'

const Readline = SerialPort.parsers.Readline

const port = new SerialPort('COM1', {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
})

var sign = '+'

port.on('data', (data) => {
        const snap = data.toString()

        if (snap === '0' || snap === '-') {
                sign = snap === '0' ? '+' : '-'
        } else {
                const reading = snap ? snap.split('=').join('').split('').reverse().join('') : ''
                const signed = +(sign + +reading)

		

		  pubsub.publish('NEW_READING', {
		    reading: signed,
		  })
        }
})

const db = {
  records: new PouchDB('records'),
}

export enum events {
  NEW_READING = 'NEW_READING',
}

const pubsub = new PubSub()

setInterval(() => {
}, 1000)

const resolvers = {
  Query: {
    users: () => [
      {
        id: '0001',
        name: {
          first: 'Ameer',
        },
      },
    ],
  },
  Subscription: {
    reading: {
      subscribe: () => pubsub.asyncIterator([events.NEW_READING]),
    },
  },
  Mutation: {
    createRecord: (parent: any, args: any, context: any, info: any) => {
      console.log(args)

      db.records
        .put({
          _id: new Date().getTime().toString(),
          createdAt: args.createdAt,
          weights: [
            {
              createdAt: args.createdAt,
              weight: args.weight,
            },
          ],
          licensePlate: {
            number: args.plateNumber,
            code: args.plateCode,
            region: args.plateRegion,
          },
        })
        .then(console.log)
      return args.plateNumber.length
    },
  },
}

export default resolvers
