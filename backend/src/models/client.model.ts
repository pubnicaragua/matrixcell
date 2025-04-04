export class Client {
    id?: number | null;
    identity_number: string | null;
    identity_type: string | null;
    name: string | null;
    address: string | null;
    phone: string | null;
    city: string | null;
    due_date: string | Date | null;
    created_at:  string | Date | null;
    grant_date:  string | Date | null;
    debt_type: string | null; // Probablemente sea 'string' en vez de 'Date'
    deadline: number | null; // plazo
    email: string | null;
    deleted: boolean;
    frequency: string | null; // frecuencia de pago
    store_id: number | null;
    contract_number: string | null;

    constructor() {
        this.identity_number = null;
        this.identity_type = null;
        this.name = null;
        this.address = null;
        this.phone = null;
        this.city = null;
        this.due_date = null;
        this.debt_type = null;
        this.deadline = 0;
        this.grant_date = null
        this.created_at = null;
        this.email = null;
        this.id = null;
        this.frequency = null;
        this.deleted = false;
        this.store_id = null;
        this.contract_number = null;
    }
}