export class AuditLog{
    id?: number|null;
    event: string | null;
    user: number | null;
    timestamp: Date|null;
    details: JSON | null;
    constructor(){
        this.event = null;
        this.user = null;
        this.timestamp = null;
        this.details = null;
    }
}