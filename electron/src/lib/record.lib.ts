import { LicensePlate, Vehicle } from '../../../src/model/vehicle.model'

export const asVehicle = (vehicle: any) =>
  ({
    id: (vehicle.id || vehicle._id) as string,
    type: vehicle.type,
    licensePlate: {
      plate: vehicle.licensePlateNumber,
      code: vehicle.licensePlateCode,
      region: {
        code: vehicle.licensePlateRegion,
      },
    } as LicensePlate,
  } as Vehicle)
