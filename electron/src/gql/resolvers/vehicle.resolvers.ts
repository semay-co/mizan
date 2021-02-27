import DB from '../../db'
import { v4 as uuid } from 'uuid'

export const createVehicle = async (parent: any, args: any) => {
  const vehicles = await DB.vehicles.find({
    selector: {
      licensePlateNumber: args.plateNumber,
      licenseCode: args.plateCode,
      licenseRegion: args.plateRegion,
    },
    fields: ['createdAt', 'plateNumber', 'plateCode', 'plateRegion'],
  })

  if (vehicles.docs.length > 0) {
    const vehicleId = vehicles.docs[0]._id
    return vehicleId
  } else {
    const query = await DB.vehicles
      .put({
        _id: uuid(),
        createdAt: new Date().getTime(),
        size: args.size,
        licensePlateNumber: args.plateNumber,
        licensePlateCode: args.plateCode,
        licensePlateRegion: args.plateRegion,
        docType: 'vehicle',
      })
      .catch(console.error)

    if (query) {
      return query.id
    }
  }
}

export const editLicensePlate = async (parent: any, args: any) => {
  const vehicle = args.vehicleId

  console.log(vehicle)
}

export const vehicles = async (parent: any, args: any) => {
  const vehicles = DB.vehicles.allDocs({
    include_docs: true,
  })

  return (await vehicles).rows
    .map((row) => {
      return {
        ...row.doc,
        id: row.id,
      } as any
    })
    .filter((row) => row.docType === 'vehicle')
    .filter(
      (vehicle) =>
        !args.query ||
        vehicle.licensePlateNumber
          .toLowerCase()
          .includes(args.query.toLowerCase())
    )
    .map((vehicle) => {
      return {
        id: vehicle.id.toString(),
        size: vehicle.size,
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
    size: vehicle.size,
    licensePlate: {
      code: vehicle.licensePlateCode,
      plate: vehicle.licensePlateNumber,
      region: {
        code: vehicle.licensePlateRegion,
      },
    },
  }
}
