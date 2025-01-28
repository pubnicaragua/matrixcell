// Dispositivo (devices)
export interface Dispositivo {
  id: number;
  imei?: string | null;
  owner?: number | null;
  status?: string | null;
  modelo?: string | null;
  marca?: string | null;
  store_id?: number | null;
  unlock_code?: string | null;
  ip?: string | null;
  precio?: number | null; // Puede ser null
}

// Plan de Pago (payment_plans)
export interface PlanPago {
  id: number;
  device_id: number | null;
  months: number | null;
  weekly_payment: number | null;
  monthly_payment: number | null;
  total_cost: number | null;
}

// Contrato (contracts)
export interface Contrato {
  id: number;
  created_at: string;
  device_id: number | null;
  payment_plan_id: number | null;
  down_payment: number | null; // Esto corresponde al depósito inicial
  next_payment_date: string | null;
  next_payment_amount: number | null;
  payment_progress: number | null;
  status: string | null;
}

// Relación extendida para facilitar el manejo en la UI
export interface TerminoPago {
  id: number;
  dispositivo: Dispositivo; // Relación con un dispositivo
  deposito: number; // Depósito inicial (viene de `down_payment` en los contratos)
  plazo: number; // Plazo del contrato en meses
  pagoMensual: number; // Monto del pago mensual
  pagoSemanal: number; // Monto del pago semanal
  costoTotal: number; // Costo total del contrato
  fechaInicio: Date; // Fecha de inicio del contrato
  pagosPendientes: number; // Meses o semanas restantes
}
