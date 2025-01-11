export class Notification {
    id?: number | null;
    created_at?: Date| string | null;
    message: string | null;
    user_id?: number | null;
    invoice_id?: number | null;
    status: string | null;
    constructor() {
        this.created_at = null;
        this.message = null;
        this.user_id = null;
        this.invoice_id = null;
        this.status = null;
    }
  }