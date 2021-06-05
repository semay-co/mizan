import DB from '../../db'
import * as _ from 'ramda'
import { v4 as uuid } from 'uuid'
import { print } from '../../printer/printer'
import { PAGE_TYPES } from '../../../../src/model/print.model'
import { asVehicle } from '../../lib/vehicle.lib'
import { asCustomer } from '../../lib/customer.lib'
import { sendSms } from '../../sms/sms'

const base36 = require('base36')

const serialStart = process.env.SERIAL_START || 100000

export const records = async (parent: any, args: any) => {
  const filters = args.filters

  const result = await DB.records.allDocs({
    include_docs: true,
  })

  const sortByCreated = _.descend(
    _.compose(_.prop('createdAt') as any, _.prop('doc') as any)
  )

  const sorted = _.sort(sortByCreated, result.rows)

  const rows = _.filter((row: any) => row.doc.docType === 'record')(sorted)

  const records = await Promise.all(
    _.map(async (row: any) => {
      const doc = row.doc as any

      const vehicle = doc.vehicleId
        ? {
            vehicle: (await DB.vehicles
              .get(doc.vehicleId)
              .then((vehicle: any) => vehicle as any)
              .then(asVehicle)) as any,
          }
        : {}

      const seller = doc.sellerId
        ? {
            seller: (await DB.customers
              .get(doc.sellerId)
              .then(asCustomer)) as any,
          }
        : {}

      const buyer = doc.buyerId
        ? {
            buyer: (await DB.customers
              .get(doc.buyerId)
              .then(asCustomer)) as any,
          }
        : {}

      return {
        ...row.doc,
        id: row.id,
        ...vehicle,
        ...seller,
        ...buyer,
      }
    })(rows as any)
  )

  const filtered =
    filters && filters.includes('pending')
      ? _.filter((record: any) => record.weights.length <= 1)(records)
      : records

  const filteredByVehicle = _.filter(
    (record: any) => !args.vehicleId || record.vehicleId === args.vehicleId
  )(filtered)

  const filteredByQuery = _.filter((record: any) => {
    return args.query
      ? record.serial.toLowerCase().includes(args.query.toLowerCase()) ||
          record.vehicle?.licensePlate?.plate
            ?.toLowerCase()
            .includes(args.query.toLowerCase())
      : true
  })(filteredByVehicle)

  const limited = filteredByQuery.slice(0, args.limit || 10)

  return limited
}

export const createRecord = async (parent: any, args: any) => {
  const docs = await DB.records.allDocs({
    include_docs: true,
  })

  const records = _.filter((row: any) => row.doc.docType === 'record')(
    docs.rows
  ) as any

  const serials = _.map((row: any) => base36.base36decode(row.doc.serial) || 0)(
    records
  )

  const highest = _.reduce(_.max)(0, serials) || serialStart

  const saveRecord = (vehicleId: string, sellerId: string, buyerId: string) => {
    const creation = DB.records.put({
      _id: uuid(),
      docType: 'record',
      createdAt: new Date().getTime(),
      serial: base36.base36encode((highest as number) + 1),
      weights: [
        {
          createdAt: args.weightTime || new Date().getTime(),
          weight: args.weight,
          manual: args.manual || false,
        },
      ],
      vehicleId,
      sellerId,
      buyerId,
    })

    return creation.then((doc: any) => doc)
  }

  const vehicleDoc = await DB.vehicles.get(args.vehicleId).then(asVehicle)
  const vehicle = args.vehicleId && {
    vehicle: vehicleDoc,
  }

  const sellerDoc =
    args.sellerId && (await DB.customers.get(args.sellerId).then(asCustomer))

  const seller =
    args.sellerId && sellerDoc
      ? {
          seller: sellerDoc,
        }
      : {}

  const buyerDoc =
    args.buyerId && (await DB.customers.get(args.buyerId).then(asCustomer))

  const buyer =
    args.buyerId && buyerDoc
      ? {
          buyer: buyerDoc,
        }
      : {}

  const save = await saveRecord(args.vehicleId, args.sellerId, args.buyerId)

  const record = (await DB.records.get(save.id)) as any

  if (record)
    return {
      ...record,
      id: record._id,
      ...vehicle,
      ...seller,
      ...buyer,
    }
}

export const update = async (parent: any, args: any) => {
  const id = args.id
  const record = (await DB.records.get(args.id)) as any

  const update = {
    ...record,
    updatedAt: new Date().getTime(),
  }
}

export const addCustomer = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any

  console.log('args', args)

  const customer =
    args.customerType === 'seller'
      ? {
          sellerId: args.customerId,
        }
      : {
          buyerId: args.customerId,
        }

  const doc = {
    ...record,
    ...customer,
  }

  return await DB.records.put(doc)
}

export const addSecondWeight = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any

  const doc = {
    ...record,
    updatedAt: new Date().getTime(),
    weights: _.append({
      createdAt: args.createdAt || new Date().getTime(),
      weight: args.weight,
      manual: args.manual || false,
    })(record.weights),
  }

  await DB.records.put(doc)

  const vehicle = await DB.vehicles
    .get(doc.vehicleId)
    .then((vehicle: any) => vehicle as any)
    .then(asVehicle)

  const seller =
    doc.sellerId && (await DB.customers.get(doc.sellerId).then(asCustomer))

  const buyer =
    doc.buyerId && (await DB.customers.get(doc.buyerId).then(asCustomer))

  console.log('doc')
  console.log({
    ...doc,
    id: doc._id,
    vehicle,
    seller: seller,
    buyer,
  })

  return {
    ...doc,
    id: doc._id,
    vehicle,
    seller,
    buyer,
  }
}

export const record = async (parent: any, args: any) => {
  console.log(args.id)
  const doc = await DB.records
    .get(args.id)
    .then((record: any) => record as any)
    .then((record: any) => ({
      id: record._id,
      ...record,
    }))

  const vehicle = await DB.vehicles
    .get(doc.vehicleId)
    .then((vehicle: any) => vehicle as any)
    .then(asVehicle)

  const seller =
    doc.sellerId && (await DB.customers.get(doc.sellerId).then(asCustomer))

  const buyer =
    doc.buyerId && (await DB.customers.get(doc.buyerId).then(asCustomer))

  console.log('seller')
  console.log(seller)

  const record = {
    ...doc,
    vehicle,
    seller,
    buyer,
  }

  return record
}

export const sendConfirmationSms = async (parent: any, args: any) => {
  // const doc = await DB.records
  //   .get(args.id)
  //   .then((record: any) => record as any)
  //   .then((record: any) => ({
  //     id: record._id,
  //     ...record,
  //   }))

  // sendSms('+251944108619', 'hello, can you hear me?')

  return 'okay!'
}

export const printRecord = async (parent: any, args: any) => {
  const doc = await DB.records
    .get(args.id)
    .then((record: any) => record as any)
    .then((record: any) => ({
      id: record._id,
      ...record,
    }))

  console.log(doc)

  const vehicleSpread = doc.vehicleId
    ? {
        vehicle: await DB.vehicles.get(doc.vehicleId).then(asVehicle),
      }
    : {}

  const sellerSpread = doc.sellerId
    ? {
        seller: await DB.customers.get(doc.sellerId).then(asCustomer),
      }
    : {}

  const buyerSpread = doc.buyerId
    ? {
        buyer: await DB.customers.get(doc.buyerId).then(asCustomer),
      }
    : {}

  const record = {
    ...doc,
    ...vehicleSpread,
    ...sellerSpread,
    ...buyerSpread,
    netWeight: Math.abs(doc.weights[0]?.weight - doc.weights[1]?.weight),
  }

  const numbers = []

  record.buyer && numbers.push(record.buyer?.phoneNumber?.number)
  record.seller && numbers.push(record.seller?.phoneNumber?.number)

  const msgLines = [`1st Wt: ${record.weights[0].weight}KG`]

  record.weights[1] && msgLines.push(`2nd Wt: ${record.weights[1].weight}KG`)
  record.weights[1] &&
    msgLines.push(
      `Net Wt: ${Math.abs(
        +record.weights[1].weight - +record.weights[0].weight
      )}KG`
    )
  const licensePlate = record.vehicle?.licensePlate
  msgLines.push(
    `License Plate: (${licensePlate?.code})${
      licensePlate?.plate
    }[${licensePlate?.region?.code?.slice(0, 2)}]`
  )

  msgLines.push(`Serial: ${record.serial.toUpperCase()}`)
  msgLines.push('-- FURI MIZAN | ፉሪ ሚዛን')

  console.log(msgLines)

  sendSms(numbers.join(';'), msgLines.join('  \n'))

  return record.weights?.length > 1
    ? print(record, PAGE_TYPES.ORIGINAL) && print(record, PAGE_TYPES.COPY)
    : print(record, PAGE_TYPES.PENDING)
}
