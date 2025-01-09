export class Operation {
    id?: number;
    created_at: string | Date | null;
    operation_number: string | null;
    operation_value: number;
    due_date: Date | string | null;
    amount_due: number;
    amount_paid: number;
    days_overdue: number;
    cart_value: number;
    judicial_action: number;
    refinanced_debt: Date | string | null;
    prox_due_date: Date | string | null;
    client_id: number | null;
    updated_at: Date | string | null;

    constructor() {
        this.created_at = null;
        this.operation_number = null;
        this.operation_value = 0;
        this.due_date = null;
        this.amount_due = 0;
        this.amount_paid = 0;
        this.days_overdue = 0;
        this.cart_value = 0;
        this.judicial_action = 0;
        this.refinanced_debt = null;
        this.prox_due_date = null;
        this.updated_at = null;
        this.client_id = null;
    }

}