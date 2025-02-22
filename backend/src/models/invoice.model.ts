export class Invoice{
    id?: number|null;
    amount: number | null;
    number: string | null;
    client_name: string | null;
    status: string | null;
    created_at: Date|null;
    operation_id: number | null;
    store_id: number | null;
    constructor(){
        this.amount = null;
        this.number = null;
        this.status = null;
        this.client_name = null;
        this.created_at = null;
        this.operation_id = null;
        this.store_id = null;
    }
}