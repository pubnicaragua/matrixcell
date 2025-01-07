export class Invoice{
    id?: number|null;
    amount: number | null;
    number: string | null;
    device_id: number | null;
    status: string | null;
    created_at: Date|null;
    constructor(){
        this.amount = null;
        this.number = null;
        this.status = null;
        this.device_id = null;
        this.created_at = null;
    }
}