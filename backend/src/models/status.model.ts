export class Status {
    id?: number | null;
    created_at: Date|string | null;
    updated_at: Date|string | null;
    client_id: number | null;
    total_operations: number | null;
    total_due: number | null;
    total_overdue: number | null;
    judicial_operations: number | null;
    status: string | null;
    last_payment_date: Date | string |null;

    constructor() {
        this.created_at = null;
        this.updated_at = null;
        this.client_id = null;
        this.total_operations = null;
        this.total_due = null;
        this.total_overdue = null;
        this.judicial_operations = null;
        this.status = null;
        this.last_payment_date = null;
       
    }
  }