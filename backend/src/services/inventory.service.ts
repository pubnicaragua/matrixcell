import supabase from "../config/supabaseClient";
import { ProductoExcel } from "../interface/productExcel.interface";
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
export const createProduct =async(item: ProductoExcel, modeloId: string, category_id:number): Promise<string> =>  {
    try {
        const { data: newProducto, error: newProductoError } = await supabase
            .from('products')
            .insert({
                article: item.nombre_producto,
                code: item.codigo_item,
                price: item["Precio al cliente"],
                busines_price: item["precio para negocio"],
                model_id: modeloId,
                category_id:category_id,
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