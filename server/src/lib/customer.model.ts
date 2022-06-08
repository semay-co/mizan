export interface Customer {
  id: string
  createdAt: number
  phoneNumber: {
    number: number
  }
  name: {
    display: string
  }
}
