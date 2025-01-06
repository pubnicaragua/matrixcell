export class Payment{
    id?: number|null;
    created_at: Date|string|null;
    operation_id: number|null;
    client_id: number|null;
    payment_date: Date|string|null;
    amount_paid: number|null;
    payment_method: string | null;
    receipt_number: string|null;
    updated_at: Date|string|null;
    constructor(){
        this.created_at = null;
        this.operation_id = null;
        this.client_id = null;
        this.payment_date = null;
        this.amount_paid = null;
        this.payment_method = null;
        this.receipt_number = null;
        this.updated_at = null;
    }
}