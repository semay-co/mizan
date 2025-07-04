import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { PathLike } from 'node:fs'

PouchDB.plugin(PouchDBFind)

const ensureExists = (path: PathLike, mask: number = 777) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, mask, (err) => {
      if (err) {
        if (err.code === 'EEXIST') resolve(null)
        else reject(err)
      } else resolve(null)
    })
  })
}

const mizanDir = path.join(os.homedir(), '.mizan')
const backupDir = path.join(mizanDir, 'backup')
const dbDir = path.join(mizanDir, 'db')

const init = async () => {
  await ensureExists(mizanDir)
  await ensureExists(backupDir)
  await ensureExists(dbDir)
}

init()

const DB = {
  records: new PouchDB(`${dbDir}/records`),
  vehicles: new PouchDB(`${dbDir}/vehicles`),
  customers: new PouchDB(`${dbDir}/customers`),
  materials: new PouchDB(`${dbDir}/materials`),
  meta: new PouchDB(`${dbDir}/meta`),
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

// DB.records
//   .allDocs({
//     include_docs: true,
//   })
//   .then((docs) => docs.rows)
//   .then((rows) => JSON.stringify(rows))
//   .then((rows) =>
//     fs.writeFile(
//       path.join(backupDir, `records.backup.${new Date().getTime()}`),
//       rows,
//       () => {}
//     )
//   )

// DB.vehicles
//   .allDocs({
//     include_docs: true,
//   })
//   .then((docs) => docs.rows)
//   .then((rows) => JSON.stringify(rows))
//   .then((rows) =>
//     fs.writeFile(
//       path.join(backupDir, `vehicles.backup.${new Date().getTime()}`),
//       rows,
//       () => {}
//     )
//   )

// DB.customers
//   .allDocs({
//     include_docs: true,
//   })
//   .then((docs) => docs.rows)
//   .then((rows) => JSON.stringify(rows))
//   .then((rows) =>
//     fs.writeFile(
//       path.join(backupDir, `customers.backup.${new Date().getTime()}`),
//       rows,
//       () => {}
//     )
//   )

export default DB
