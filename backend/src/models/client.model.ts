export class Client {
    id?: number | null;
    identity_number: string | null;
    identity_type: string | null;
    name: string | null;
    address: string | null;
    email:string | null;
    phone: string | null;
    city: string | null;
    due_date: string | Date | null;
    deadline: string | Date | null;
    deubt_type: string | null;
    operation_number: number | null;
    status : string | null;
    category : string | null;
    created_at: Date | string | null;
    constructor() {
        this.identity_number = null;
        this.identity_type = null;
        this.name = null;
        this.address = null;
        this.phone = null;
        this.email = null;
        this.city = null;
        this.due_date = null;
        this.deadline = null;
        this.deubt_type = null;
        this.operation_number = null;
        this.status = null;
        this.category = null;
        this.created_at = null;
    }
}