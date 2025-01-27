export class Contract{
    id?: number|null;
    device_id: number|null;
    payment_plan_id: number|null;
    down_payment: number|null;
    next_payment_date: number|null;
    next_payment_amount: number|null;
    payment_progress: number|null;
    status: string|null;
    created_at: Date|string|null;
    constructor(){
        this.device_id = null;
        this.payment_plan_id = null;
        this.down_payment = null;
        this.next_payment_date = null;
        this.next_payment_amount = null;
        this.payment_progress = null;
        this.status = null;
        this.created_at = null;
    }

}