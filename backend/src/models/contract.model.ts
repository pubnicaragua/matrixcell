import { Device } from './device.model';
import { PaymentPlan } from './paymentPlan.model';


export class Contract {
    id?: number;
    created_at: string;
    device_id: number;
    payment_plan_id: number;
    down_payment: number;
    next_payment_amount: number;
    payment_progress: number;
    status: string;
    next_payment_date: string;
    nombre_cliente: string;

    // Relaciones
    device?: Device; // Asociar con dispositivo
    paymentPlan?: PaymentPlan; // Asociar con plan de pago

    constructor() {
        this.device_id = 0;
        this.payment_plan_id = 0;
        this.down_payment = 0;
        this.next_payment_date = '';
        this.next_payment_amount = 0;
        this.payment_progress = 0;
        this.status = '';
        this.created_at = '';
        this.nombre_cliente = '';
    }

}