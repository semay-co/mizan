export interface Vehicle {
  id: string
  type: number
  createdAt: number
  licensePlate: LicensePlate
  isDeleted: boolean
}

export interface LicensePlate {
  plate: string
  code: string
}

export const PLATE_CODES = ['OTHER', 1, 2, 3, 4, 5]
export const PLATE_REGIONS = [
  { code: 'OTHER', name: 'OTHER' },
  { code: 'AA', name: 'ADDIS ABABA' },
  { code: 'AF', name: 'AFAR' },
  { code: 'AM', name: 'AMHARA' },
  { code: 'BG', name: 'BENI SHANGUL GUMUZ' },
  { code: 'DR', name: 'DIRE DAWA' },
  { code: 'ET', name: 'ETHIOPIA' },
  { code: 'GB', name: 'GAMBELLA' },
  { code: 'HR', name: 'HARARI' },
  { code: 'OR', name: 'OROMIA' },
  { code: 'SI', name: 'SIDAMA' },
  { code: 'SM', name: 'SOMALI' },
  { code: 'SW', name: 'SOUTH WEST' },
  { code: 'SP', name: 'SOUTHERN PEOPLE' },
  { code: 'TG', name: 'TIGRAY' },
]

export const VEHICLE_TYPES = [
  'PICKUP',
  'ISUZU',
  'FSR',
  'SINO TRUCK',
  'TRUCK & TRAILER',
]

export const VEHICLE_TYPES_FORMAL = [
  'SMALL VEHICLE',
  'LIGHT TRUCK',
  'MIDIUM TRUCK',
  'HEAVY TRUCK',
  'TRUCK & TRAILER',
]