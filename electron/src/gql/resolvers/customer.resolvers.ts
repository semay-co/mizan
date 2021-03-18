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

    console.log(query)

    if (query) {
      const customer = await DB.customers.get(query.id).then(asCustomer)
      console.log(customer)
      return customer
    }
  }
}

export const customers = async (parent: any, args: any) => {
  const customers = DB.customers.allDocs({
    include_docs: true,
  })

  return (await customers).rows
    .map((row: any) => {
      return {
        ...row.doc,
        id: row.id,
      } as any
    })
    .filter((row: any) => row.docType === 'customer')
    .filter(
      (customer: any) =>
        !args.query || customer.phoneNumber.includes(args.query.toString())
    )
    .map(asCustomer)
    .slice(0, args.limit)
}

export const customer = async (parent: any, args: any) => {
  const customer = (await DB.customers.get(args.id)) as any

  return asCustomer(customer)
}
