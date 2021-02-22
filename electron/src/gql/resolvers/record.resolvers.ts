import DB from '../../db'
import * as _ from 'ramda'
import { v4 as uuid } from 'uuid'

export const records = async (parent: any, args: any) => {
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
        sweet: 'home',
        id: row.id,
        vehicle,
      }
    })(rows)
  )

  const filteredByVehicle = _.filter(
    (record: any) => !args.vehicleId || record.vehicleId === args.vehicleId
  )(records)

  const filtered = _.filter(
    (record: any) =>
      !args.query ||
      record.vehicle?.licensePlate?.plate
        ?.toLowerCase()
        .includes(args.query.toLowerCase())
  )(filteredByVehicle)
  console.log(filtered)

  console.log(args)
  return filtered
}

export const createRecord = async (parent: any, args: any) => {
  const saveRecord = (vehicleId: string) => {
    const creation = DB.records.put({
      _id: uuid(),
      docType: 'record',
      createdAt: new Date().getTime(),
      weights: [
        {
          createdAt: args.createdAt || new Date().getTime(),
          weight: args.weight,
        },
      ],
      vehicleId,
    })

    return creation.then((doc) => doc.id)
  }

  const vehicle = await DB.vehicles.get(args.vehicleId)

  if (vehicle) {
    saveRecord(vehicle._id)
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

export const record = async (parent: any, args: any) => {}
