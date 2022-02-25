import { Customer } from '../../../src/model/customer.model'

export const asCustomer = (customer: any) =>
  ({
    id: (customer.id || customer._id) as string,
    phoneNumber: {
      number: customer.phoneNumber,
    },
    name: {
      display: customer.name,
    },
    createdAt: customer.createdAt,
  } as Customer)
