import DB from '../../db'
import { v4 as uuid } from 'uuid'
import { asVehicle } from '../../lib/vehicle.lib'

const { log, info, error } = console

export const createVehicle = async (parent: any, args: any) => {
  // const vehicles = await DB.vehicles.find({
  //   selector: {
  //     licensePlateNumber: args.plateNumber,
  //     licenseCode: args.plateCode,
  //     licenseRegion: args.plateRegion,
  //   },
  //   fields: ['createdAt', 'plateNumber', 'plateCode', 'plateRegion'],
  // })

  const vehicles = await DB.vehicles.allDocs({
    include_docs: true,
  })

  const existing = vehicles.rows
    .map(
      (row) =>
      ({
        ...row.doc,
        id: row.id,
      } as any)
    )
    .filter(
      (row) =>
        row.licensePlateNumber === args.plateNumber &&
        row.licensePlateCode === args.plateCode &&
        row.licensePlateRegion === args.plateCode
    )

  if (existing.length > 0) {
    const vehicleId = existing[0]._id
    return vehicleId
  } else {
    const query = await DB.vehicles
      .put({
        _id: uuid(),
        createdAt: new Date().getTime(),
        type: args.type,
        licensePlateNumber: args.plateNumber,
        licensePlateCode: args.plateCode,
        licensePlateRegion: args.plateRegion,
        docType: 'vehicle',
      })
      .catch(error)

    log(query)

    if (query) {
      return await DB.vehicles.get(query.id).then(asVehicle)
    }
  }
}

export const updateVehicle = async (parent: any, args: any) => {
  const { id, plateNumber, plateCode, plateRegion, type } = args

  const vehicleDoc = (await DB.vehicles.get(id)) as any

  const number = plateNumber ? {
    licensePlateNumber: plateNumber
  } : {}

  const code = plateCode ? {
    licensePlateCode: plateCode
  } : {}

  const region = plateRegion ? {
    licensePlateRegion: plateRegion
  } : {}

  const vehicleType = !isNaN(type) ? {
    type
  } : {}

  const update = {
    ...vehicleDoc,
    ...number,
    ...code,
    ...region,
    ...vehicleType,
  }

  DB.vehicles.put(update)

  return asVehicle(update)
}

export const search = async (parent: any, args: any) => {
  // DB.vehicles.search
}

export const vehicles = async (parent: any, args: any) => {
  const vehicles = DB.vehicles.allDocs({
    include_docs: true,
  })

  return (await vehicles).rows
    .map((row: any) => {
      return {
        ...row.doc,
        id: row.id,
      } as any
    })
    .filter((row: any) => row.docType === 'vehicle')
    .filter(
      (vehicle: any) =>
        !args.query ||
        vehicle.licensePlateNumber
          .toLowerCase()
          .includes(args.query.toLowerCase())
    )
    .map((vehicle: any) => {
      return {
        id: vehicle.id.toString(),
        type: vehicle.type,
        licensePlate: {
          code: vehicle.licensePlateCode,
          region: {
            code: vehicle.licensePlateRegion,
          },
          plate: vehicle.licensePlateNumber,
        },
      }
    })
    .slice(0, args.limit)
}

export const vehicle = async (parent: any, args: any) => {
  const vehicle = (await DB.vehicles.get(args.id)) as any

  return {
    ...vehicle,
    id: vehicle._id,
    type: vehicle.type,
    licensePlate: {
      code: vehicle.licensePlateCode,
      plate: vehicle.licensePlateNumber,
      region: {
        code: vehicle.licensePlateRegion,
      },
    },
  }
}
