export class DeviceLog{
    id?: number|null;
    device_id: number|null;
    action: string | null;
    performed_by: string | null;
    timestamp: Date|null;

    constructor(){
        this.device_id = null;
        this.action = "Bloqueado";
        this.performed_by = null;
        this.timestamp = null;
    }
}