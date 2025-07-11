export default `type Query {
  users: [User]
  records(
    query: String
    limit: Int
    page: Int
    vehicleId: String
    serial: String
    licensePlate: String
    filters: [String]
  ): RecordResult
  record(id: String!): Record
  vehicles(query: String, limit: Int): [Vehicle]
  vehicle(id: String): Vehicle
  customers(phoneNumber: String, name: String, limit: Int): [Customer]
  customer(id: String): Customer
}

type Mutation {
  createRecord(
    weight: Int!
    weightTime: String
    manual: Boolean!
    vehicleId: String!
    sellerId: String
    buyerId: String
  ): Record
  createCustomer(phoneNumber: String!, name: String!): Customer
  addSecondWeight(
    recordId: String!
    weight: Int!
    createdAt: String!
    manual: Boolean
  ): Record
  addCustomer(
    recordId: String!
    customerId: String!
    customerType: String!
  ): Record
  printRecord(id: String!): String
  sendConfirmationSms(recordId: String!): String
  createVehicle(
    type: Int!
    plateNumber: String!
    plateCode: Int!
    plateRegion: String!
  ): Vehicle
  updateVehicle(
    id: String!
    type: Int
    plateNumber: String
    plateCode: Int
    plateRegion: String
  ): Vehicle
}

type User {
  id: ID!
  name: Name!
  createdAt: String!
}

type Product {
  id: ID!
  name: String!
}

type LicensePlateRegion {
  code: String!
  name: String!
}

type LicensePlate {
  code: Int
  region: LicensePlateRegion
  plate: String!
}

type Vehicle {
  id: ID!
  type: Int
  licensePlate: LicensePlate!
}

type Country {
  phoneCode: Int
  name: String!
}

type PhoneNumber {
  number: String!
  countryCode: Country!
}

type Customer {
  id: ID!
  createdAt: String!
  name: Name!
  phoneNumber: PhoneNumber
}

type Name {
  display: String
  first: String
  last: String
}

type Weight {
  createdAt: String
  weight: Int!
  manual: Boolean
}

type Record {
  id: ID!
  createdAt: String!
  updatedAt: String
  seller: Customer
  buyer: Customer
  operator: User
  vehicle: Vehicle
  product: Product
  serial: String
  weights: [Weight]
}

type RecordResult {
  payload: [Record]
  count: Int
}

type Subscription {
  reading: Float!
}`
