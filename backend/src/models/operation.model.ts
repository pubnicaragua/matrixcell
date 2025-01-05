export class Operation{
    id?: number;
    operation_type: string|null;
    amount_due: number;
    client_id: number|null;
    operation_date: Date|string|null;
    constructor(){
        this.operation_type =null;
        this.client_id=null;
        this.amount_due = 0;
        this.operation_date = null;
    }

}