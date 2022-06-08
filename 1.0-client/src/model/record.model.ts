export interface Record {
  createdAt: string
  userId: string
  vehicleId: string
  customerId: string
  weight: number
}

export interface RecordDraft {
  currentWeight: number
}
