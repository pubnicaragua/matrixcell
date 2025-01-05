export class Client{
    id?: number|null;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    category: string | null;
    status: string | null;
    constructor(){
        this.id = null;
        this.name = null;
        this.email = null;
        this.phone = null;
        this.address = null;
        this.category = null;
        this.status = null;
    }
}