import { PubSub } from 'apollo-server'
import PouchDB from 'pouchdb'

const db = {
  records: new PouchDB('records'),
}

export enum events {
  NEW_READING = 'NEW_READING',
}

const pubsub = new PubSub()

setInterval(() => {
  const rand = Math.floor(Math.random() * 1000) * 10

  pubsub.publish('NEW_READING', {
    reading: rand,
  })
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
