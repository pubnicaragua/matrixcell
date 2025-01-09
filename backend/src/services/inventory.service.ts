import supabase from "../config/supabaseClient";
interface ProductoExcel {
    store: string;           // Código de la tienda
    modelo_producto: string; // Nombre del modelo del producto
    nombre_producto: string; // Nombre del producto
    codigo_item: string;     // Código único del producto
    cantidad: number;        // Cantidad de products
    precio:number;
}
   // Función auxiliar para crear un modelo de producto
   export const createProductModel = async(nombre: string): Promise<string> => {
    try {
        const { data: newModel, error: newModelError } = await supabase
            .from('models')
            .insert({name: nombre })
            .select('id')
            .single();

        if (newModelError) {
            throw new Error(`Error al crear modelo de producto: ${newModelError.message}`);
        }

        if (!newModel || !newModel.id) {
            throw new Error('Error inesperado: No se recibió el ID del modelo creado.');
        }

        return newModel.id;
    } catch (error) {
        throw new Error(`Error en createProductModel: ${error instanceof Error ? error.message : String(error)}`);
    }
}
// Función auxiliar para crear un producto
export const createProduct =async(item: ProductoExcel, modeloId: string): Promise<string> =>  {
    try {
        const { data: newProducto, error: newProductoError } = await supabase
            .from('products')
            .insert({
                article: item.nombre_producto,
                code: item.codigo_item,
                price: item.precio,
                model_id: modeloId,

            })
            .select('id')
            .single();

        if (newProductoError) {
            throw new Error(`Error al crear producto: ${newProductoError.message}`);
        }

        if (!newProducto || !newProducto.id) {
            throw new Error('Error inesperado: No se recibió el ID del producto creado.');
        }

        return newProducto.id;
    } catch (error) {
        throw new Error(`Error en createProduct: ${error instanceof Error ? error.message : String(error)}`);
    }
}