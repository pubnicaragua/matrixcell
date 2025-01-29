export class PaymentPlan{
    id?: number|null;
    device_id:number|null;
    months:number|null;
    weekly_payment:number|null;
    monthly_payment:number|null;
    total_cost:number|null;
    created_at:Date|string|null;
    
    constructor(){
        this.device_id = null;
        this.months = null;
        this.weekly_payment = null;
        this.monthly_payment = null;
        this.total_cost = null;
        this.created_at = null;
    }
}