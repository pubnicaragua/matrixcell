export class Payment{
    id?: number|null;
    contract_id: number|null;
    payment_date: string|Date|null;
    amount: number|null;
    created_at: Date|string|null;
    constructor(){
        this.contract_id = null;
        this.payment_date = null;
        this.amount = null;
        this.created_at = null;
    }
}