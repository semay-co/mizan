import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind)

const DB = {
  records: new PouchDB('.db/records'),
  vehicles: new PouchDB('.db/vehicles'),
}

DB.records.createIndex({
  index: {
    fields: ['createdAt', 'vehicleId'],
  },
})

DB.vehicles.createIndex({
  index: {
    fields: ['createdAt', 'plateNumber', 'plateCode', 'plateRegion'],
  },
})

export default DB
