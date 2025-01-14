export interface ProductoExcel {
    store: string;           // Código de la tienda
    modelo_producto: string; // Nombre del modelo del producto
    nombre_producto: string; // Nombre del producto
    codigo_item: string;     // Código único del producto
    Cantidad: number;        // Cantidad de products
    code_category:string;
    'Precio al cliente':string;
    'precio para negocio':string;
    categoria:string;
}