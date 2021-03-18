import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import fs from 'fs'
import os from 'os'
import path from 'path'

PouchDB.plugin(PouchDBFind)

const DB = {
  records: new PouchDB('.db/records'),
  vehicles: new PouchDB('.db/vehicles'),
  customers: new PouchDB('.db/customers'),
  meta: new PouchDB('.db/meta'),
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

DB.customers.createIndex({
  index: {
    fields: ['createdAt', 'phoneNumber', 'name'],
  },
})

const backupDir = path.join(os.homedir(), '.mizan')

fs.mkdir(backupDir, (dir) => dir)

DB.records
  .allDocs({
    include_docs: true,
  })
  .then((docs) => docs.rows)
  .then((rows) => JSON.stringify(rows))
  .then((rows) =>
    fs.writeFile(
      path.join(backupDir, `records.backup.${new Date().getTime()}`),
      rows,
      () => {}
    )
  )

DB.vehicles
  .allDocs({
    include_docs: true,
  })
  .then((docs) => docs.rows)
  .then((rows) => JSON.stringify(rows))
  .then((rows) =>
    fs.writeFile(
      path.join(backupDir, `vehicles.backup.${new Date().getTime()}`),
      rows,
      () => {}
    )
  )

DB.customers
  .allDocs({
    include_docs: true,
  })
  .then((docs) => docs.rows)
  .then((rows) => JSON.stringify(rows))
  .then((rows) =>
    fs.writeFile(
      path.join(backupDir, `customers.backup.${new Date().getTime()}`),
      rows,
      () => {}
    )
  )

export default DB
