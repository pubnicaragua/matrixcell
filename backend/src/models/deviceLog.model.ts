export class DeviceLog{
    id?: number|null;
    device_id: number|null;
    action_id: number | null;
    perform_user_id: number | null;
    created_at: Date|string|null;

    constructor(){
        this.device_id = null;
        this.action_id = null;
        this.perform_user_id = null;
        this.created_at = null;
    }
}