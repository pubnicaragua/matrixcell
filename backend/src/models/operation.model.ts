export class Operation {
    id?: number;
    created_at: string | Date | null;
    operation_number: string | null;
    operation_type: string | null;
    operation_date: Date | string | null;
    due_date: Date | string | null;
    amount_due: number;
    amount_paid: number;
    days_overdue: number;
    status: string | null;
    judicial_action: boolean ;
    updated_at: Date |string | null;

    constructor() {
        this.created_at = null;
        this.operation_number = null;
        this.operation_type = null;
        this.operation_date = null;
        this.due_date = null;
        this.amount_due = 0;
        this.amount_paid = 0;
        this.days_overdue = 0;
        this.status = null;
        this.judicial_action = false;
        this.updated_at = null;
    }

}