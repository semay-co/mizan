import DB from '../../db'
import { v4 as uuid } from 'uuid'
import { asCustomer } from '../../lib/customer.lib'

export const createCustomer = async (parent: any, args: any) => {
  const lookup = await DB.customers.find({
    selector: {
      phoneNumber: args.phoneNumber,
    },
    fields: ['phoneNumber'],
  })

  if (lookup.docs.length > 0) {
    const customerId = lookup.docs[0]._id
    return customerId
  } else {
    const query = await DB.customers
      .put({
        _id: uuid(),
        createdAt: new Date().getTime(),
        phoneNumber: args.phoneNumber,
        name: args.name,
        docType: 'customer',
      })
      .catch(console.error)

    if (query) {
      const customer = await DB.customers.get(query.id).then(asCustomer)
      return customer
    }
  }
}

export const customers = async (parent: any, args: any) => {
  const customers = await DB.customers.allDocs({
    include_docs: true,
  })

  const name = args.name?.trim().toLowerCase()
  const phoneNumber = args.phoneNumber?.toString().trim()

  // TODO: implement fuzzy search, already implemented it's a matter of prioritizing exact matches
  // first items that start with the query, then items that contain the query, then items that fuzzy match
  const res = customers.rows
    .map((row: any) => {
      return {
        ...row.doc,
        id: row.id,
      } as any
    })
    .filter((row: any) => row.docType === 'customer')
    .filter((customer: any) => {
      const searchableName = customer.name
        .toLowerCase()
        .split(/[aeiouy\s]+/)
        .join('')
      const searchableNameQuery = name?.split(/[aeiouy\s]+/).join('')

      return (
        (!phoneNumber && !name) ||
        (phoneNumber && customer.phoneNumber?.includes(phoneNumber)) ||
        (name && customer.name?.toLowerCase().includes(name))
        // || searchableName.includes(searchableNameQuery)
      )
    })
    .map(asCustomer)
    .slice(0, args.limit)
  console.log(args)
  console.log(res)

  return res
}

export const customer = async (parent: any, args: any) => {
  const customer = (await DB.customers.get(args.id)) as any

  return asCustomer(customer)
}

export const updateCustomer = async (parent: any, args: any) => {
  const customer = (await DB.customers.get(args.id)) as any

  const name = args.name ? {
    name: args.name
  } : {}

  const phoneNumber = args.phoneNumber ? {
    phoneNumber: args.phoneNumber
  } : {}

  const doc = {
    ...customer,
    ...name,
    ...phoneNumber
  }

  await DB.customers.put(doc)

  return (await DB.customers.get(args.id)) as any
}
