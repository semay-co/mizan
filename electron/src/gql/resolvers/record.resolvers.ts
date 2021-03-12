import DB from '../../db'
import * as _ from 'ramda'
import { v4 as uuid } from 'uuid'
import { print } from '../../printer/printer'
import { PAGE_TYPES } from '../../../../src/model/print.model'

const base36 = require('base36')

const serialStart = process.env.SERIAL_START || 100000

const formatVehicle = (vehicle: any) => ({
  id: vehicle._id,
  type: vehicle.type,
  licensePlate: {
    plate: vehicle.licensePlateNumber,
    code: vehicle.licensePlateCode,
    region: {
      code: vehicle.licensePlateRegion,
    },
  },
})

export const records = async (parent: any, args: any) => {
  const filters = args.filters

  const docs = await DB.records.allDocs({
    include_docs: true,
  })

  // docs.rows.map((record: any, i: number) =>
  //   DB.records.put({
  //     ...record.doc,
  //     recordNumber: undefined,
  //     serial: base36.base36encode(i + 100000),
  //   })
  // )

  const rows = _.filter((row: any) => row.doc.docType === 'record')(docs.rows)

  const records = await Promise.all(
    _.map(async (row: any) => {
      const vehicle = (await DB.vehicles
        .get((row.doc as any).vehicleId)
        .then((vehicle) => vehicle as any)
        .then((vehicle) => ({
          id: vehicle._id,
          type: vehicle.type,
          licensePlate: {
            plate: vehicle.licensePlateNumber,
            code: vehicle.licensePlateCode,
            region: {
              code: vehicle.licensePlateRegion,
            },
          },
        }))) as any

      return {
        ...row.doc,
        id: row.id,
        vehicle,
      }
    })(rows)
  )

  const filtered =
    filters && filters.includes('pending')
      ? _.filter((record: any) => record.weights.length <= 1)(records)
      : records

  const filteredByVehicle = _.filter(
    (record: any) => !args.vehicleId || record.vehicleId === args.vehicleId
  )(filtered)

  const limited = filteredByVehicle.slice(0, args.limit || 10)

  return _.filter((record: any) => {
    return args.query
      ? record.serial.toLowerCase().includes(args.query.toLowerCase()) ||
          record.vehicle?.licensePlate?.plate
            ?.toLowerCase()
            .includes(args.query.toLowerCase())
      : true
  })(limited)
}

export const createRecord = async (parent: any, args: any) => {
  const docs = await DB.records.allDocs({
    include_docs: true,
  })

  const records = _.filter((row: any) => row.doc.docType === 'record')(
    docs.rows
  )

  if (process.env.SERIAL_MIGRATION) {
  } else {
    const serials = _.map(
      (row: any) => base36.base36decode(row.doc.serial) || 0
    )(records)

    const highest = _.reduce(_.max)(0, serials) || serialStart

    const saveRecord = (vehicleId: string) => {
      const creation = DB.records.put({
        _id: uuid(),
        docType: 'record',
        createdAt: new Date().getTime(),
        serial: base36.base36encode((highest as number) + 1),
        weights: [
          {
            createdAt: args.createdAt || new Date().getTime(),
            weight: args.weight,
          },
        ],
        vehicleId,
      })

      return creation.then((doc) => doc)
    }

    const vehicle = (await DB.vehicles.get(args.vehicleId)) as any

    if (vehicle) {
      const save = await saveRecord(vehicle._id)

      const record = (await DB.records.get(save.id)) as any

      console.log(record)
      console.log(vehicle)

      if (record)
        return {
          ...record,
          id: record._id,
          vehicle: {
            ...vehicle,
            id: vehicle._id,
            licensePlate: {
              code: vehicle.licensePlateCode,
              plate: vehicle.licensePlateNumber,
              region: {
                code: vehicle.licensePlateRegion,
              },
            },
          },
        }
    }
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

export const addSecondWeight = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any

  const doc = {
    ...record,
    updatedAt: new Date().getTime(),
    weights: _.append({
      createdAt: args.createdAt || new Date().getTime(),
      weight: args.weight,
    })(record.weights),
  }

  await DB.records.put(doc)

  const vehicle = await DB.vehicles
    .get(doc.vehicleId)
    .then((vehicle) => vehicle as any)
    .then(formatVehicle)

  console.log({
    ...doc,
    id: doc._id,
    vehicle,
  })

  return {
    ...doc,
    id: doc._id,
    vehicle,
  }
}

export const record = async (parent: any, args: any) => {
  console.log(args.id)
  const doc = await DB.records
    .get(args.id)
    .then((record) => record as any)
    .then((record) => ({
      id: record._id,
      ...record,
    }))

  const vehicle = await DB.vehicles
    .get(doc.vehicleId)
    .then((vehicle) => vehicle as any)
    .then(formatVehicle)

  const record = {
    ...doc,
    vehicle,
  }

  return record
}

export const printRecord = async (parent: any, args: any) => {
  const doc = await DB.records
    .get(args.id)
    .then((record) => record as any)
    .then((record) => ({
      id: record._id,
      ...record,
    }))

  console.log(doc)

  const vehicle = await DB.vehicles
    .get(doc.vehicleId)
    .then((vehicle) => vehicle as any)
    .then(formatVehicle)

  const record = {
    ...doc,
    netWeight: Math.abs(doc.weights[0]?.weight - doc.weights[1]?.weight),
    vehicle,
  }

  return record.weights?.length > 1
    ? print(record, PAGE_TYPES.ORIGINAL) && print(record, PAGE_TYPES.COPY)
    : print(record, PAGE_TYPES.PENDING)
}
