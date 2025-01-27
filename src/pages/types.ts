export interface Dispositivo {
    marca: string
    modelo: string
    precio: number
    deposito: number
  }
  
  export interface TerminoPago {
    id?: number
    dispositivo: Dispositivo
    plazo: number
    pagoMensual: number
    pagoSemanal: number
    costoTotal: number
    fechaInicio: Date
    pagosPendientes: number
  }
  
  export interface Contract {
    id: number
    created_at: string
    amount: number
    initial_amount: number
    brand: string
    model: string
    weekly_pay: number
    monthly_pay: number
    total_cost: number
    term: string
    remaining_time: number
    next_payment_date: string
    next_payment_amount: number
  }
  
  