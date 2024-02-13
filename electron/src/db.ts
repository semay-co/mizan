import PouchDB from 'pouchdb'
// import * as search from 'pouchdb-quick-search'

import PouchDBFind from 'pouchdb-find'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { PathLike } from 'node:fs'

PouchDB.plugin(PouchDBFind)
// PouchDB.plugin(search)

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
const remoteUrl = 'http://mizanadmin:$implepass2022@159.223.1.144:5984'

const db = (name: string, remote: boolean = false) => {
  return new PouchDB(`${remote ? remoteUrl : dbDir}/${name}`)
}

const DB = {
  records: db('records'),
  vehicles: db('vehicles'),
  customers: db('customers'),
  materials: db('materials'),
  meta: db('meta'),
}


const remotes = {
  records: db('records', true),
  vehicles: db('vehicles', true),
  customers: db('customers', true),
  materials: db('materials', true),
  meta: db('meta', true),
}

const syncOptions = {
  batch_size: 5,
  batches_limit: 2,
  live: true,
  retry: true,
  back_off_function(delay: number) {
    if (delay >= 1000*60 || delay === 0) {
      return 1000;
    }

    return delay * 3
  },
}

DB.records.sync(remotes.records, syncOptions).then(() => console.log('synced', 'records')).catch(console.error).finally(() => console.log('sync finished'))
DB.vehicles.sync(remotes.vehicles, syncOptions).then(() => console.log('synced', 'vehicles')).catch(console.error).finally(() => console.log('sync finished'))
DB.customers.sync(remotes.customers, syncOptions).then(() => console.log('synced', 'customers')).catch(console.error).finally(() => console.log('sync finished'))
DB.materials.sync(remotes.materials, syncOptions).then(() => console.log('synced', 'materials')).catch(console.error).finally(() => console.log('sync finished'))
DB.meta.sync(remotes.meta, syncOptions).then(() => console.log('synced', 'meta')).catch(console.error).finally(() => console.log('sync finished'))

DB.records.createIndex({
  index: {
    fields: ['serial'],
  },
})

DB.records.createIndex({
  index: {
    fields: ['shortKey'],
  },
})

DB.records.createIndex({
  index: {
    fields: ['createdAt'],
  },
})

DB.records.createIndex({
  index: {
    fields: ['vehicleId'],
  },
})

DB.records.createIndex({
  index: {
    fields: ['vehicleId', 'createdAt'],
  },
})

DB.vehicles.createIndex({
  index: {
    fields: ['createdAt'],
  },
})

DB.vehicles.createIndex({
  index: {
    fields: ['plateNumber'],
  },
})

DB.customers.createIndex({
  index: {
    fields: ['createdAt'],
  },
})

DB.customers.createIndex({
  index: {
    fields: ['phoneNumber'],
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
