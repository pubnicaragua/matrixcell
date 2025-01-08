import { Request, Response } from "express";
import supabase from "../config/supabaseClient";
import { BaseService } from "../services/base.service";
import { MovimientoInventario } from "../models/movimientoInventario.model";

export const InventoryController = {
    async inventoryMoved(req: Request, res: Response) {
        try {
            // Datos recibidos desde el frontend
            const { userId } = req;
            const { store_id, inventario_id, cantidad, tipo_movimiento, motivo, codigoProducto } = req.body;

            let inventario;

            // Verificar si se proporciona inventario_id primero
            if (inventario_id) {
                // Paso 1: Buscar el inventario utilizando el inventario_id
                const { data: inventarioData, error: inventarioError } = await supabase
                    .from('inventario')
                    .select('*')
                    .eq('id', inventario_id)  // Filtrar por inventario_id
                    .eq('store_id', store_id)  // Filtrar por store_id
                    .single();

                // Si no existe inventario para el inventario_id, retornar un error
                if (inventarioError || !inventarioData) {
                    throw new Error('Inventario no encontrado para este inventario_id y store.');
                }
                inventario = inventarioData;  // Usamos el inventario encontrado
            } else if (codigoProducto) {
                // Paso 2: Buscar el producto por el codigoProducto y luego el inventario
                const { data: producto, error: productoError } = await supabase
                    .from('productos')
                    .select('product_id')
                    .eq('codigo', codigoProducto)
                    .single();

                // Si no se encuentra el producto, retornar un error
                if (productoError || !producto) {
                    throw new Error('Producto no encontrado con el código proporcionado.');
                }

                const product_id = producto.product_id;  // Guardamos el ID del producto encontrado

                // Paso 3: Buscar el inventario utilizando el product_id y store_id
                const { data: inventarioData, error: inventarioError } = await supabase
                    .from('inventario')
                    .select('*')
                    .eq('product_id', product_id)  // Filtrar por product_id
                    .eq('store_id', store_id)     // Filtrar por store_id
                    .single();

                // Si no existe inventario para el producto en esa store, retornar un error
                if (inventarioError || !inventarioData) {
                    throw new Error('Inventario no encontrado para este producto en la store especificada.');
                }
                inventario = inventarioData;  // Usamos el inventario encontrado
            } else {
                throw new Error('Se debe proporcionar al menos un inventario_id o codigoProducto.');
            }

            // Definir el cambio en cantidad_fisica y stock dependiendo del tipo de movimiento
            let cambioCantidadFisica = 0;
            let cambioStock = 0;

            // Lógica de acuerdo al tipo de movimiento
            if (tipo_movimiento === 'entrada') {
                cambioCantidadFisica = cantidad;
                cambioStock = cantidad;
            } else if (tipo_movimiento === 'salida') {
                cambioCantidadFisica = -cantidad;
                cambioStock = -cantidad;
            } else if (tipo_movimiento === 'ajuste') {
                cambioCantidadFisica = cantidad;
                cambioStock = 0;  // El ajuste no afecta el stock
            } else {
                throw new Error('Tipo de movimiento no válido. Use "entrada", "salida" o "ajuste".')
            }

            // Paso 4: Actualizar el inventario según el tipo de movimiento
            const { data: updatedInventario, error: updateError } = await supabase
                .from('inventario')
                .update({
                    cantidad_fisica: inventario.stock + cambioStock,
                    stock: inventario.stock + cambioStock,
                })
                .eq('id', inventario.id);

            // Registrar el movimiento de inventario
            await BaseService.create<MovimientoInventario>('movimiento_inventario', {
                inventario_id: inventario.id,
                cantidad,
                tipo_movimiento,
                motivo
            }, userId);

            // Si hubo un error al actualizar el inventario
            if (updateError) {
                throw new Error('Error al actualizar el inventario.')
            }

            // Devolver la respuesta con el inventario actualizado
            res.status(200).json({
                mensaje: 'Movimiento registrado correctamente',
                inventario_actualizado: updatedInventario,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar el movimiento de inventario.' });
        }
    },
    async storeMoved(req: Request, res: Response) {
        const { product_id, origen_store, destino_store, cantidad } = req.body;
        try {
            // Verificar stock en la store de origen
            const { data: sourceStock, error: stockError } = await supabase
                .from('inventario')
                .select('stock')
                .eq('product_id', product_id)
                .eq('store_id', origen_store)
                .single();

            if (stockError || !sourceStock || sourceStock.stock < cantidad) {
                 res.status(400).json({ error: 'Stock insuficiente' });
            }

            // Reducir stock en la store de origen
            const { error: updateSourceError } = await supabase
                .from('inventario')
                .update({
                    stock: sourceStock?.stock - cantidad,
                    cantidad_fisica: sourceStock?.stock - cantidad
                })
                .eq('product_id', product_id)
                .eq('store_id', origen_store);

            if (updateSourceError) {
                 res.status(500).json({ error: 'Error al actualizar stock de origen' });
            }

            // Verificar y actualizar o insertar stock en la store destino
            const { data: destStock } = await supabase
                .from('inventario')
                .select('stock, cantidad_fisica')
                .eq('product_id', product_id)
                .eq('store_id', destino_store)
                .single();

            if (destStock) {
                const { error: updateDestError } = await supabase
                    .from('inventario')
                    .update({
                        stock: destStock.stock + cantidad,
                        cantidad_fisica: destStock.cantidad_fisica + cantidad
                    })
                    .eq('product_id', product_id)
                    .eq('store_id', destino_store);

                if (updateDestError) {
                     res.status(500).json({ error: 'Error al actualizar stock de destino' });
                }
            } else {
                const { error: insertDestError } = await supabase
                    .from('inventario')
                    .insert({
                        product_id,
                        store_id: destino_store,
                        stock: cantidad,
                        cantidad_fisica: cantidad
                    });

                if (insertDestError) {
                     res.status(500).json({ error: 'Error al insertar stock en destino' });
                }
            }

            // Registrar el movimiento
            const { error: movementError } = await supabase
                .from('movimientos')
                .insert({
                    product_id,
                    store_origen: origen_store,
                    store_destino: destino_store,
                    cantidad,
                    fecha: new Date().toISOString()
                });

            if (movementError) {
                 res.status(500).json({ error: 'Error al registrar movimiento' });
            }

            // Responder con éxito
            res.status(200).json({ message: 'Transferencia completada correctamente' });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: `Error en transferencia: ${error.message}` });
        }
    }
    
}