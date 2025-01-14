export class Inventory{
    id?: number|null;
    product_id: number|string|null;
    store_id: number|null;
    stock: number|null;
    cantidad_fisica: number|string|null;
    imei?:string|null;
    constructor(){
        this.product_id = null;
        this.store_id = null;
        this.stock = null;
        this.cantidad_fisica = null;
        this.imei= null;
    }
}