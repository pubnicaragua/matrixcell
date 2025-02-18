// types.ts

export interface Invoice {
  status: string
  created_at: string
  operation_id: number
}

export interface Device {
  id: number
  imei: string
  status: string
}

export interface Client {
  id?: number
  name: string
  phone: string
  address: string
  city: string
  identity_number: string
  identity_type: string
  due_date: string //fecha de corte
  grant_date: string //fecha de concesión
  debt_type: string //tipo de deudor
  deadline: number //plazo
  email: string
  deleted: boolean
  store_id: number
  store?: {
    name: string
  }
}

export interface Store {
  id?: number,
  name: string
}

export interface Operation {
  id?: number
  operation_number: string
  operation_value: number
  due_date: string
  prox_due_date: string
  amount_due: number
  amount_paid: number
  days_overdue: number
  cart_value: number
  refinanced_debt: string
  judicial_action: number
  client_id: number
  client?: {
    // Agrega esta propiedad opcional
    id: number
    name: string
    phone: string
  }
}

export interface Dataset {
  label: string
  data: number[]
  backgroundColor: string[] | string
  hoverBackgroundColor: [] | string
  borderColor?: string
  borderWidth?: number
}

export interface ChartData {
  labels: string[]
  datasets: Dataset[]
}

export interface ClientListProps {
  clients: Client[]
  stores: Store[]
  setSelectedClient: (client: Client | null, isEditing?: boolean) => void
  fetchClientsAndOperations: () => Promise<void>
  softDeleteClient: (id: number) => Promise<void>
  restoreClient: (id: number) => Promise<void>
}

export interface OperationListProps {
  operations: Operation[]
  clients: Client[]
  stores: Store[]
  setSelectedOperation: (operation: Operation) => void
  deleteOperation: (id: number) => void
}

export interface SendInvoiceFormProps {
  email: string
  setEmail: (email: string) => void
  handleSendEmail: () => void
}

export interface ExportReportProps {
  clients: Client[]
  operations: Operation[]
  stores: Store[]
}

