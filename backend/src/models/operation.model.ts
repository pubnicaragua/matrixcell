export class Operation {
    id?: number;
    created_at: string | Date | null;
    operation_number: string | null;
    operation_value: number | null; // Cambiado para reflejar que puede ser nulo
    due_date: Date | string | null; // Cambiado a string para alinearse con la tabla
    amount_due: number | null; // Puede ser nulo
    amount_paid: number | null; // Puede ser nulo
    days_overdue: number | null; // Puede ser nulo
    cart_value: number | null; // Puede ser nulo
    judicial_action: string | null; // Cambiado a string
    refinanced_debt: string | null; // Al igual que en la tabla
    prox_due_date: Date | string | null; // Refleja la tabla
    client_id: number | null; // Puede ser nulo
    updated_at: Date | string | null;

    constructor() {
        this.created_at = null;
        this.operation_number = null;
        this.operation_value = null;
        this.due_date = null;
        this.amount_due = null;
        this.amount_paid = null;
        this.days_overdue = null;
        this.cart_value = null;
        this.judicial_action = null;
        this.refinanced_debt = null;
        this.prox_due_date = null;
        this.updated_at = null;
        this.client_id = null;
    }
}
