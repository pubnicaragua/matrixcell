export class AuditLog{
    id?: number|null;
    event: string | null;
    user_id: number | null;
    created_at: Date|null;
    details: JSON | null;
    constructor(){
        this.event = null;
        this.user_id = null;
        this.created_at = null;
        this.details = null;
    }
}