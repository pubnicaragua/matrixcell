export class MovimientoInventario {
    id?:number|null;
    inventario_id: number | null;
    cantidad: string | null;
    tipo_movimiento: string | null;
    motivo: string | null;
    constructor() {
        this.inventario_id = null;
        this.cantidad = null;
        this.tipo_movimiento = null;
        this.motivo = null;
    }}