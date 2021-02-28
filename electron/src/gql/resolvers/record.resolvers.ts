import DB from '../../db'
import * as _ from 'ramda'
import { v4 as uuid } from 'uuid'
import { print } from '../../printer/printer'

const base36 = require('base36')

const base36 = require('base36')

export const records = async (parent: any, args: any) => {
  const filters = args.filters

  const docs = await DB.records.allDocs({
    include_docs: true,
  })

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

  console.log(args)

  const filtered =
    filters && filters.includes('pending')
      ? _.filter((record: any) => record.weights.length <= 1)(records)
      : records

  const filteredByVehicle = _.filter(
    (record: any) => !args.vehicleId || record.vehicleId === args.vehicleId
  )(filtered)

  const result = _.filter((record: any) => {


    const queryLower = args.query?.toLowerCase()

    console.log(typeof(base36.base36encode(record.recordNumber)))

    const isInRecordNumber = base36.base36encode(record.recordNumber).
    toLowerCase().includes(queryLower)(filteredByVehicle)
    
    const isInLicensePlate = record.vehicle?.licensePlate?.plate
        ?.toLowerCase()
        .includes(args.query.toLowerCase())


    return !args.query ||
      isInRecordNumber || isInLicensePlate
      
    })(filteredByVehicle)

  return result
}

export const createRecord = async (parent: any, args: any) => {
  const docs = await DB.records.allDocs({
    include_docs: true,
  })

  const records = _.filter((row: any) => row.doc.docType === 'record')(
    docs.rows
  )

  if (process.env.SERIAL_MIGRATION) {
    records.map((record: any, i: number) =>
      DB.records.put({
        ...record.doc,
        recordNumber: undefined,
        serial: base36.base36encode(i + 100000),
      })
    )
  } else {
    const serials = _.map(
      (row: any) => base36.base36decode(row.doc.serial) || 0
    )(records)

    const highest = _.reduce(_.max)(0, serials) || 100000

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

    const vehicle = await DB.vehicles.get(args.vehicleId)

    if (vehicle) {
      const newRecord = await saveRecord(vehicle._id)

      return newRecord.id
    }
  }
}

export const addSecondWeight = async (parent: any, args: any) => {
  const record = (await DB.records.get(args.recordId)) as any

  DB.records.put({
    ...record,
    weights: _.append({
      createdAt: new Date().getTime(),
      weight: args.weight,
    })(record.weights),
  })
}

export const record = async (parent: any, args: any) => {
  console.log(args.id)
  const recordOnly = await DB.records
    .get(args.id)
    .then((record) => record as any)
    .then((record) => ({
      id: record._id,
      ...record,
    }))

  const vehicle = await DB.vehicles
    .get(recordOnly.vehicleId)
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
    }))

  const record = {
    ...recordOnly,
    vehicle,
  }

  return record
}

export const printRecord = async (parent: any, args: any) => {
  const recordOnly = await DB.records
    .get(args.id)
    .then((record) => record as any)
    .then((record) => ({
      id: record._id,
      ...record,
    }))

  console.log(recordOnly)

  const vehicle = await DB.vehicles
    .get(recordOnly.vehicleId)
    .then((vehicle) => vehicle as any)
    .then((vehicle) => ({
      id: vehicle._id,
      type: vehicle.type,
      licensePlate: {
        plate: vehicle.licensePlateNumber,
        code: vehicle.licensePlateCode,
        region: vehicle.licensePlateRegion,
      },
    }))

  const record = {
    ...recordOnly,
    netWeight: Math.abs(
      recordOnly.weights[0]?.weight - recordOnly.weights[1]?.weight
    ),
    vehicle,
  }

  return record.weights?.length > 1
    ? print(record) && print(record, 'copy')
    : print(record, 'attachment') && print(record, 'file')
}
