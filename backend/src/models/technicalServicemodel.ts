export class TechnicalService{
    id?: number|null;
    client: string | null;
    service_type: string | null;
    description: string | null;
    status: string;
    cost: number | null;
    store_id: number | null;
    created_at: Date|null;
    product_id: number | null;
    constructor(){
        this.client = null;
        this.service_type = null;
        this.description = null;
        this.status = "Pendiente";
        this.cost = null;
        this.store_id = null;
        this.created_at = null;
        this.product_id = null;
    }
}




