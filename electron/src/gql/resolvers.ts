import { PubSub } from 'apollo-server'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import SerialPort from 'serialport'

const pubsub = new PubSub()
const comPort = 'COM1'

const publish = (reading: number) => {
  pubsub.publish('NEW_READING', {
    reading,
  })
}

SerialPort.list().then((ports) => {
  const search = ports
    .map((port) => port.path.toLowerCase())
    .filter((path) => path === comPort.toLowerCase())

  if (search.length > 0) {
    const port = new SerialPort(comPort, {
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
        const reading = snap
          ? snap.split('=').join('').split('').reverse().join('')
          : ''
        const signed = +(sign + +reading)

        publish(signed)
      }
    })
  } else {
    setInterval(() => {
      publish(Math.floor(Math.random() * 1000) * 10)
    }, 1000)
  }
})

PouchDB.plugin(PouchDBFind)

const db = {
  records: new PouchDB('.db/records'),
  vehicles: new PouchDB('.db/vehicles'),
}

db.records.createIndex({
  index: {
    fields: ['createdAt', 'vehicleId'],
  },
})

db.vehicles.createIndex({
  index: {
    fields: ['createdAt', 'plateNumber', 'plateCode', 'plateRegion'],
  },
})

export enum events {
  NEW_READING = 'NEW_READING',
}

setInterval(() => {}, 1000)

const resolvers = {
  Query: {
    records: async () => {
      const records = await db.records.allDocs({
        include_docs: true,
      })

      console.log(records)

      return (
        records.rows
          // .map((row: any) => {})
          .filter((row: any) => {
            return row.doc.docType === 'record'
          })
          .map(async (record) => {
            const vehicle = await db.vehicles
              .get((record.doc as any).vehicleId)
              .then((doc) => {
                const vehicleDoc = doc as any

                console.log('vehicle doc')
                console.log(vehicleDoc)
                return {
                  id: doc._id,
                  licensePlate: {
                    plate: vehicleDoc.licensePlateNumber,
                    code: vehicleDoc.licensePlateCode,
                    region: vehicleDoc.licensePlateRegion,
                  },
                }
              })
              .catch(console.error)

            console.log('vehicle')
            console.log(vehicle)

            return {
              ...record.doc,
              id: record.id,
              vehicle,
            }
          })
      )
    },
  },
  Subscription: {
    reading: {
      subscribe: () => pubsub.asyncIterator([events.NEW_READING]),
    },
  },
  Mutation: {
    createRecord: (parent: any, args: any, context: any, info: any) => {
      console.log(args)

      const saveRecord = (vehicleId: string) => {
        db.records
          .put({
            _id: new Date().getTime().toString(),
            docType: 'record',
            createdAt: args.createdAt,
            weights: [
              {
                createdAt: args.createdAt,
                weight: args.weight,
              },
            ],
            vehicleId,
          })
          .then(console.log)
          .catch(console.error)
      }

      db.vehicles
        .find({
          selector: {
            licensePlateNumber: args.plateNumber,
          },
          fields: ['createdAt', 'plateNumber', 'plateCode', 'plateRegion'],
        })
        .then((res) => {
          console.log('find result:')
          console.log(res)

          if (res.docs.length > 0) {
            console.log('vehicle found:')
            console.log(res.docs)

            const vehicleId = res.docs[0]._id

            saveRecord(vehicleId)
          } else {
            console.log('no vehicle found, creating')

            db.vehicles
              .put({
                _id: new Date().getTime().toString(),
                licensePlateNumber: args.plateNumber,
                licensePlateCode: args.plateCode,
                licensePlateRegion: args.plateRegion,
                docType: 'vehicle',
              })
              .then((res) => {
                console.log('vehicle created:')
                console.log(res)
                const vehicleId = res.id

                saveRecord(vehicleId)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)

      return args.plateNumber.length
    },
  },
}

export default resolvers
