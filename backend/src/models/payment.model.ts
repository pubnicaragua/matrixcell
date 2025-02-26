export class Payment {
    id?: number | null;
    created_at: Date | string | null;
    operation_id: number | null;
    client_id: number | null;
    payment_date: string | Date | null;
    amount_paid: number | null;
    receipt_number: string | null;
    contract_id: number | null;
    amount: number | null;
    constructor() {
        this.contract_id = null;
        this.payment_date = null;
        this.amount = null;
        this.created_at = null;
        this.operation_id = null;
        this.client_id = null;
        this.amount_paid = null;
        this.receipt_number = null;
    }
}