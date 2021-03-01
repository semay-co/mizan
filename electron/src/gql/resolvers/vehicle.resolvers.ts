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
        type: args.type,
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

  if (process.env.MIGRATE_VEHICLE_TYPE || true) {
    ;(await vehicles).rows.map((row) => {
      console.log(row)

      const c2 = ["428d9e70-f91f-4150-ad8f-15ea061aa0ea",
       "428d9e70-f91f-4150-ad8f-15ea061aa0ea",
       "9b4c7cc5-f280-41b2-ba69-b63540789eab",
          "7a3b3778-d423-4e53-a570-a497060701e4",
          "428d9e70-f91f-4150-ad8f-15ea061aa0ea",
          "eb9cf6c5-c0e5-41c6-8162-943ba7d0281d",
          "523a2cc8-4b1a-47f7-bf91-e45fea17aebe",
          "95f46a84-98c0-463a-9229-9ee34643f15a",
          "f507e99c-1778-4377-9fd3-6d2cbfe05b29",
          "c8744986-4dee-4191-a578-7a771bc7c4be",]

      DB.vehicles
        .put({
          ...row.doc,
          type: c2.includes(row.id) ? 2 : (row.doc as any).type,
        })
        .catch(console.error)
    })
  }

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
