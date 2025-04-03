export interface Payment {
  id: number
  client_id: number
  operation_id: number
  amount_paid: number
  amount: number
  receipt_number: string
  payment_date: string
  created_at: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone: string
  store_id: number
}

export interface Operation {
  id: number
  operation_number: string
  client_id: number
  amount_paid: number
}

export interface Store {
  id: number
  name: string
}

export interface EditPaymentData {
  id: number
  amount_paid: number
  receipt_number: string
  payment_date: string
}

export interface SortConfig {
  field: string
  direction: "asc" | "desc"
}

export interface FilterConfig {
  searchTerm: string
  paymentDate: string // Cambiado de startDate/endDate a solo paymentDate
}


