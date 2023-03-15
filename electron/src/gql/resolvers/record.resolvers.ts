import DB from '../../db'
import * as _ from 'ramda'
import { v4 as uuid } from 'uuid'
import { print } from '../../printer/printer'
import { PAGE_TYPES } from '../../../../src/model/print.model'
import { asVehicle } from '../../lib/vehicle.lib'
import { asCustomer } from '../../lib/customer.lib'
import { sendSms } from '../../sms/sms'
import dotenv from 'dotenv-flow'

dotenv.config()

const smsSignature = process.env.SMS_SIGNATURE || 'FURI MIZAN | ፉሪ ሚዛን'

const base36 = require('base36')

const serialStart = process.env.SERIAL_START || 100000

const sortByCreated: any = _.descend(
  _.compose(_.prop('createdAt') as any, _.prop('doc') as any) as any
)

const getRecords = async (createdAt = { $gt: new Date().getTime() - 1000 * 60 * 60 * 24 * 3}) => {

  const result = await DB.records.find({
    selector: {
      createdAt
    },
    sort: [{createdAt: 'desc'}]
  })

  return result
}

export const records = async (parent: any, args: any) => {
  const startTime = new Date().getTime()
  console.time('records')

  // const result = await DB.records.allDocs({
  //   include_docs: true,
  // })

  const now = new Date().getTime()

  const fromTime = args.fromTime === 'start' ? {
    $gt: 0
  } : args.fromTime === '1month' ? {
    $gt: now - 1000 * 60 * 60 * 24 * 31
  } : args.fromTime === '1week' ? {
    $gt: now - 1000 * 60 * 60 * 24 * 7
  } : {
    $gt: now - 1000 * 60 * 60 * 24 * 15
  }

  const toTime = args.toTime ? {
    $lte: args.toTime
  } : {
    $lte: now
  }

  const createdAt = {
    ...fromTime,
    ...toTime,
  }

  const result = await getRecords(createdAt)

  const rows = _.filter((row: any) => {
    return row.docType === 'record' && (!args.vehicleId || row.vehicleId === args.vehicleId) && 
    (args.query
      ? row.serial.toLowerCase().includes(args.query.toLowerCase()) ||
          row.dataCache?.vehicle?.licensePlate?.plate
            ?.toLowerCase()
            .includes(args.query.toLowerCase())
      : true)
  })(result.docs)

  // const filtered = rows
  // filters && filters.includes('pending')
  //   ? _.filter((record: any) => record.weights.length <= 1)(records)
  //   : records

  // const filteredByVehicle = _.filter(
  //   (record: any) => 
  //   !args.vehicleId || record?.vehicleId === args.vehicleId
  // )(filtered)

  // const filteredByQuery = _.filter((record: any) => {
  //   return args.query
  //     ? record.serial.toLowerCase().includes(args.query.toLowerCase()) ||
  //         record.dataCache?.vehicle?.licensePlate?.plate
  //           ?.toLowerCase()
  //           .includes(args.query.toLowerCase())
  //     : true
  // // })(filteredByVehicle)
  // })(rows)

  const page = args.page || 0
  const limit = args.limit || 20
  // const limit = 1
  const start = page * limit
  const end = start + limit

  const sorted = _.sort(sortByCreated, rows)
  const limited = sorted.slice(start, end)

  const payload = limited.map(async (row) => {
    const doc = row as any

    // const recacheCustomers = true

    // if (recacheCustomers) {

    const seller = doc.sellerId
      ? {
          seller: await DB.customers.get(doc.sellerId).then(asCustomer),
        }
      : {}

    const buyer = doc.buyerId
      ? {
          buyer: await DB.customers.get(doc.buyerId).then(asCustomer),
        }
      : {}

    // const dataCache = {
    //   ...(doc.dataCache || {}),
    //   seller,
    //   buyer,
    // }

    // DB.records.put({
    //   ...doc,
    //   dataCache,
    // })
    // }

    // const seller = doc.sellerId && doc.dataCache?.seller
    //   ? {
    //       seller: asCustomer(doc.dataCache?.seller),
    //     }
    //   : {}

    // const buyer = doc.buyerId && doc.dataCache?.buyer
    //   ? {
    //       buyer: asCustomer(doc.dataCache?.buyer),
    //     }
    //   : {}

    const vehicle = {
      vehicle: doc.dataCache?.vehicle,
    }

    return {
      ...doc,
      ...vehicle,
      ...buyer,
      ...seller,
      id: row._id,
    }
  })

  const elapsed = new Date().getTime() - startTime

  console.timeEnd('records')

  return {
    payload,
    count: sorted.length,
    elapsed,
  }
}

const recalculateHighestSerial = async () => {

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

  return highest
}

const getCurrentSerial = async (updateCount: boolean = false) => {

  const recordState = (await DB.meta.get('recordState')) as any

  const current = recordState.currentSerial

  if (updateCount) {

    await DB.meta.put({
      ...recordState,
      currentSerial: current + 1
    })
  }

  return current
}

export const test = async (parent: any, args: any) => {
  const {vehicleId, query} = JSON.parse(args.data)

  const res = await DB.records.find({
    selector: {
      $gt: {
        createdAt: new Date().getTime()  - 1000 * 60 * 60 * 24 * 3
      }
    }  
  })
}

export const createRecord = async (parent: any, args: any) => {
  console.time('createRecord')
  const startTime = new Date().getTime()
  // const docs = await DB.records.allDocs({
  //   include_docs: true,
  // })

  // const records = _.filter((row: any) => row.doc.docType === 'record')(
  //   docs.rows
  // ) as any

  // const serials = _.map((row: any) => base36.base36decode(row.doc.serial) || 0)(
  //   records
  // )

  // const highest = _.reduce(_.max)(0, serials) || serialStart

  const highest = await getCurrentSerial(true)
  console.timeLog('createRecord', 'create record: get serial')

  const now = new Date().getTime()

  const saveRecord = async (
    vehicleId: string,
    sellerId: string,
    buyerId: string,
    dataCache: any
  ) => {

    const recordState = (await DB.meta.get('recordState')) as any
    const shortKeyStart = recordState.shortKeyStart || 1
    const shortKeyEnd = recordState.shortKeyEnd || 1

    const nextShortKeyStart = +shortKeyStart >= 999 ? 1 : +shortKeyStart + 1
    const nextShortKeyEnd = +shortKeyStart >= 999 ? +shortKeyEnd + 1 : +shortKeyEnd

    const recordStateUpdate = {
      ...recordState,
      shortKeyStart: nextShortKeyStart,
      shortKeyEnd: nextShortKeyEnd,
    }

    await DB.meta.put({
      ...recordStateUpdate,
    })

    const shortKey = _.reverse(`${shortKeyStart}-${shortKeyEnd}`)

    const creation = await DB.records.put({
      _id: uuid(),
      docType: 'record',
      createdAt: now,
      serial: base36.base36encode((highest as number) + 1),
      shortKey,
      weights: [
        {
          createdAt: args.weightTime || now,
          weight: args.weight,
          manual: args.manual || false,
        },
      ],
      vehicleId,
      sellerId,
      buyerId,
      dataCache,
    })

    return creation
  }

  const vehicleDoc = await DB.vehicles.get(args.vehicleId).then(asVehicle)
  const vehicle = args.vehicleId && {
    vehicle: vehicleDoc,
  }

  console.timeLog('createRecord', 'create record: get vehicle doc')

  const sellerDoc =
    args.sellerId && (await DB.customers.get(args.sellerId).then(asCustomer))

  const seller =
    args.sellerId && sellerDoc
      ? {
          seller: sellerDoc,
        }
      : {}

  console.timeLog('createRecord', 'create record: get seller doc')

  const buyerDoc =
    args.buyerId && (await DB.customers.get(args.buyerId).then(asCustomer))

  const buyer =
    args.buyerId && buyerDoc
      ? {
          buyer: buyerDoc,
        }
      : {}

  console.timeLog('createRecord', 'create record: get buyer doc')

  const dataCache = {
    updatedAt: now,
    ...vehicle,
    ...seller,
    ...buyer,
  }

  const save = await saveRecord(
    args.vehicleId,
    args.sellerId,
    args.buyerId,
    dataCache
  )

  console.timeLog('createRecord', 'create record: save record')

  const record = (await DB.records.get(save.id)) as any
  console.timeLog('createRecord', 'create record: get created record')


  const elapsed = new Date().getTime() - startTime
  console.timeLog('createRecord', 'create record: finished')
  console.timeEnd('createRecord')

  if (record)
    return {
      ...record,
      ...vehicle,
      ...seller,
      ...buyer,
      id: record._id,
      elapsed,
    }
}

export const updateRecord = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.id)) as any

  const remarks =
    args.remarks !== undefined
      ? {
          remarks: args.remarks,
        }
      : {}

  const isFree =
    args.isFree !== undefined
      ? {
          isFree: args.isFree,
        }
      : {}

  const isMistake =
    args.isMistake !== undefined
      ? {
          isMistake: args.isMistake,
        }
      : {}

  const isUnpaid =
    args.isUnpaid !== undefined
      ? {
          isUnpaid: args.isUnpaid,
        }
      : {}

  const update = {
    ...record,
    updatedAt: new Date().getTime(),
    ...isFree,
    ...remarks,
    ...isMistake,
    ...isUnpaid,
  }

  ;(await DB.records.put(update)) as any
  const updated = (await DB.records.get(args.id)) as any

  if (updated)
    return {
      ...updated,
      ...update.dataCache,
      id: args.id,
    }
}

export const deleteCustomer = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any

  const customer =
    args.customerType === 'seller'
      ? {
          sellerId: undefined,
        }
      : {
          buyerId: undefined,
        }

  const dataCache = {
    ...(record.dataCache || {}),
    ...(args.customerType === 'seller'
      ? {
          seller: undefined,
        }
      : {
          buyer: undefined,
        }),
  }

  const doc = {
    ...record,
    ...customer,
    ...dataCache,
  }

  return await DB.records.put(doc)
}

export const addCustomer = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any

  const customer =
    args.customerType === 'seller'
      ? {
          sellerId: args.customerId,
        }
      : {
          buyerId: args.customerId,
        }

  const customerDoc = await DB.customers.get(args.customerId).then(asCustomer)

  const customerCache =
    args.customerType === 'seller'
      ? {
          seller: customerDoc,
        }
      : {
          buyer: customerDoc,
        }

  const dataCache = {
    ...(record.dataCache || {}),
    ...customerCache,
  }

  const doc = {
    ...record,
    ...customer,
    dataCache,
  }

  return await DB.records.put(doc)
}

export const addSecondWeight = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any
  const now = new Date().getTime()

  const doc = {
    ...record,
    updatedAt: now,
    weights: _.append({
      createdAt: args.createdAt || now,
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

  return {
    ...doc,
    id: doc._id,
    vehicle,
    seller,
    buyer,
  }
}

export const record = async (parent: any, args: any) => {
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

  const record = {
    ...doc,
    vehicle,
    seller,
    buyer,
  }

  return record
}

export const sendConfirmationSms = async (parent: any, args: any) => {
  const doc = await DB.records
    .get(args.recordId)
    .then((record: any) => record as any)
    .then((record: any) => ({
      id: record._id,
      ...record,
    }))

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

  const numbers: any[] = []

  if ((!args.to || args.to === 'all' || args.to === 'buyer') && record.buyer) {
    numbers.push(record.buyer?.phoneNumber?.number)
  }
  if (
    (!args.to || args.to === 'all' || args.to === 'seller') &&
    record.seller
  ) {
    numbers.push(record.seller?.phoneNumber?.number)
  }

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
    `Plate No.: (${licensePlate?.code})${
      licensePlate?.plate
    }[${licensePlate?.region?.code?.slice(0, 2)}]`
  )

  msgLines.push(`Serial: ${record.serial.toUpperCase()}`)

  if (record.shortKey) msgLines.push(`Online Result: http://mizan.me/${record.shortKey.split('-').join('.')}`)

  msgLines.push(`-- ${smsSignature}`)

  sendSms(numbers.join(';'), msgLines.join('  \n'))
}

export const printRecord = async (parent: any, args: any) => {
  console.time('printRecord')

  const doc = await DB.records
    .get(args.id)
    .then((record: any) => record as any)
    .then((record: any) => ({
      id: record._id,
      ...record,
    }))
  console.timeLog('printRecord', 'print record: fetch record')

  const { vehicleId, sellerId, buyerId } = doc

  // const vehicleRecords = await records(null, {vehicleId})

  // const vehicleWeights = vehicleRecords?.payload.map((record: any) =>
  //   record.weights?.map((w: any) => w.weight)
  // ).reduce((a, c) => {
  //   c.forEach((el: any) => {
  //     a.push(parseInt(el))
  //   })

  //   return a
  // }, [])

  // console.log(vehicleWeights)

  // const lowest = _.min(vehicleWeights)

  // console.log('lowest:', lowest)

  const vehicleSpread = vehicleId
    ? {
        vehicle: await DB.vehicles.get(vehicleId).then(asVehicle),
      }
    : {}

  const sellerSpread = sellerId
    ? {
        seller: await DB.customers.get(sellerId).then(asCustomer),
      }
    : {}

  const buyerSpread = buyerId
    ? {
        buyer: await DB.customers.get(buyerId).then(asCustomer),
      }
    : {}

  console.timeLog('printRecord', 'print record: fetch items')

  const record = {
    ...doc,
    ...vehicleSpread,
    ...sellerSpread,
    ...buyerSpread,
    // lowest,
    netWeight: Math.abs(doc.weights[0]?.weight - doc.weights[1]?.weight),
  }

  console.timeEnd('printRecord')

  return record.weights?.length > 1
    ? print(record, PAGE_TYPES.ORIGINAL) && print(record, PAGE_TYPES.COPY)
    : print(record, PAGE_TYPES.PENDING)
}
