export class Device{
    id?: number|null;
    store_id?: number|null;
    imei: string | null;
    status: string ;
    owner: number | null;
    created_at: Date|null;
    cliente?: string |null;
    unlock_code?: string |null;
    marca?: string |null;
    modelo?: string |null;
    price?: number |null;

    constructor(){
        this.owner = null;
        this.status = "Unlocked";
        this.imei = null;
        this.store_id = null;
        this.created_at = null;
        this.unlock_code=null;
        this.marca=null;
        this.modelo=null;
        this.price=null;
    }
}