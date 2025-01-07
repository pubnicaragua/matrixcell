export class Store{
    id?: number|null;
    name: string | null;
    address: string | null;
    phone: string | null;
    active: boolean ;
    created_at: Date|null;
    constructor(){
        this.name = null;
        this.address = null;
        this.phone = null;
        this.active = true;
        this.created_at = null;
    }
}